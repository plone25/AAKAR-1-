#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Render Build Script for AAKAR
# AI-powered Advisory & Knowledge for Aspirational Rural-enterprises
# SIH 2026 - PS SIH26091
# ─────────────────────────────────────────────────────────────────────────────
set -e  # Exit immediately if any command fails

echo "============================================"
echo "  AAKAR — Render Build Script"
echo "============================================"

# ── 1. Upgrade pip ────────────────────────────────────────────────────────────
echo "[1/4] Upgrading pip..."
pip install --upgrade pip

# ── 2. Install Python dependencies ───────────────────────────────────────────
echo "[2/4] Installing Python dependencies from requirements.txt..."
pip install -r requirements.txt

# ── 3. Download spaCy English language model ─────────────────────────────────
echo "[3/4] Downloading spaCy English model (en_core_web_sm)..."
python -m spacy download en_core_web_sm

# ── 4. Download required NLTK data ───────────────────────────────────────────
echo "[4/4] Downloading NLTK datasets (punkt, stopwords, wordnet)..."
python -c "
import nltk
nltk.download('punkt',      quiet=True)
nltk.download('punkt_tab',  quiet=True)
nltk.download('stopwords',  quiet=True)
nltk.download('wordnet',    quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)
print('NLTK datasets downloaded successfully.')
"

echo "============================================"
echo "  Build complete! Ready to start server."
echo "============================================"
