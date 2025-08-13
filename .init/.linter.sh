#!/bin/bash
cd /home/kavia/workspace/code-generation/collaborative-calendar-1993-2002/calendar_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

