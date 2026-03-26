from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from datetime import datetime


def generate_pdf_report(score, features, exercises, image_path):
    filename = f"posture_report_{datetime.now().strftime('%H%M%S')}.pdf"

    doc = SimpleDocTemplate(filename)
    styles = getSampleStyleSheet()

    content = []

    # Title
    content.append(Paragraph("<b>Posture Analysis Report</b>", styles['Title']))
    content.append(Spacer(1, 20))

    # Image
    content.append(Paragraph("<b>Captured Posture:</b>", styles['Heading3']))
    content.append(Spacer(1, 10))

    try:
        img = Image(image_path, width=4 * inch, height=3 * inch)
        content.append(img)
    except:
        content.append(Paragraph("Image not available", styles['Normal']))

    content.append(Spacer(1, 20))

    # Score
    content.append(Paragraph(f"<b>Posture Score:</b> {score}/100", styles['Heading2']))
    content.append(Spacer(1, 15))

    # Issues
    content.append(Paragraph("<b>Detected Issues:</b>", styles['Heading3']))
    for key, value in features.items():
        content.append(Paragraph(f"{key}: {round(value, 3)}", styles['Normal']))

    content.append(Spacer(1, 15))

    # Exercises
    content.append(Paragraph("<b>Recommended Exercises:</b>", styles['Heading3']))
    for ex in exercises:
        content.append(Paragraph(
            f"{ex['exercise']}: {ex['description']}",
            styles['Normal']
        ))

    content.append(Spacer(1, 20))

    # Timestamp
    content.append(Paragraph(
        f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        styles['Normal']
    ))

    doc.build(content)

    return filename