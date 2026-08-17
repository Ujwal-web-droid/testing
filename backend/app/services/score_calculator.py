"""
Score Calculator & Grade Assignment.
Combines SSL, header, and sensitive file scores into a unified 0-100 score.
"""


def calculate_overall_score(
    ssl_score: int,
    headers_score: int,
    sensitive_files_score: int,
) -> int:
    """
    Calculate the overall security score (0-100).
    
    Weights:
        - SSL/TLS:          30 points max
        - Security Headers:  50 points max
        - Sensitive Files:   20 points max
        ─────────────────────────────────
        Total:              100 points
    """
    total = ssl_score + headers_score + sensitive_files_score
    return max(0, min(100, total))


def score_to_grade(score: int) -> str:
    """
    Convert a numeric score to a letter grade.
    
        90-100 → A+
        80-89  → A
        70-79  → B
        60-69  → C
        50-59  → D
        0-49   → F
    """
    if score >= 90:
        return "A+"
    elif score >= 80:
        return "A"
    elif score >= 70:
        return "B"
    elif score >= 60:
        return "C"
    elif score >= 50:
        return "D"
    else:
        return "F"


def get_score_color(score: int) -> str:
    """Return a hex color for the score badge."""
    if score >= 80:
        return "#22c55e"  # Green
    elif score >= 50:
        return "#eab308"  # Yellow
    else:
        return "#ef4444"  # Red


def get_score_label(score: int) -> str:
    """Return a human-readable label for the score."""
    if score >= 90:
        return "Excellent"
    elif score >= 80:
        return "Good"
    elif score >= 70:
        return "Fair"
    elif score >= 50:
        return "Needs Improvement"
    else:
        return "Critical"
