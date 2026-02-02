import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
from summary_service import generate_match_summary

app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/api/summary", methods=["POST"])
def summary():
    data = request.get_json()

    if not data or "youtubeUrl" not in data:
        return jsonify({"error": "youtubeUrl is required"}), 400

    youtube_url = data["youtubeUrl"]

    # Extract video metadata (optional fields)
    video_info = {
        "player1": data.get("player1"),
        "player2": data.get("player2"),
        "tournament": data.get("tournament"),
        "year": data.get("year"),
        "round": data.get("round"),
        "title": data.get("title")
    }

    print(f"Generating summary for: {youtube_url}")
    print(f"Video info: {video_info}")

    try:
        summary_text = generate_match_summary(youtube_url, video_info)
        return jsonify({"summary": summary_text})
    except Exception as e:
        print(f"Error generating summary: {e}")
        return jsonify({"error": f"Failed to generate summary: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 3001))
    print(f"Summary service running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
