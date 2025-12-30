#!/bin/bash
cd /home/kavia/workspace/code-generation/fullstack-api-viewer-3751-3760/backend_fastapi_server
source venv/bin/activate
flake8 .
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

