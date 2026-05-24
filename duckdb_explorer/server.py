#!/usr/bin/env python3
"""Local DuckDB query server for pythia-studio DuckDB Explorer.

Start from the pythia-studio directory:
    uvicorn duckdb_explorer.server:app --port 8000
"""

import shutil
import tempfile
from pathlib import Path

import duckdb
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

_TEMP_DIR = Path(tempfile.mkdtemp(prefix="duckdb_explorer_"))

app = FastAPI(title="DuckDB Explorer", docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

_EXTENSIONS = ("excel", "httpfs")


@app.on_event("startup")
def _install_extensions() -> None:
    con = duckdb.connect()
    for ext in _EXTENSIONS:
        try:
            con.execute(f"INSTALL {ext}")
        except Exception:
            pass
    con.close()


def _connect() -> duckdb.DuckDBPyConnection:
    con = duckdb.connect()
    for ext in _EXTENSIONS:
        try:
            con.execute(f"LOAD {ext}")
        except Exception:
            pass
    return con


def _safe(val: object) -> object:
    if val is None or isinstance(val, (bool, int, float, str)):
        return val
    return str(val)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)) -> JSONResponse:
    dest = _TEMP_DIR / (file.filename or "upload")
    with dest.open("wb") as f:
        shutil.copyfileobj(file.file, f)
    return JSONResponse({"path": str(dest)})


class QueryRequest(BaseModel):
    sql: str


@app.post("/query")
def run_query(req: QueryRequest) -> JSONResponse:
    try:
        con = _connect()
        try:
            result = con.execute(req.sql)
            cols = [d[0] for d in result.description]
            rows = [[_safe(v) for v in row] for row in result.fetchall()]
        finally:
            con.close()
        return JSONResponse({"columns": cols, "rows": rows})
    except Exception as exc:
        return JSONResponse(status_code=400, content={"error": str(exc)})
