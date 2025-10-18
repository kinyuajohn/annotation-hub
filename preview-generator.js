// preview-generator.js - Simple client-side preview image generation
class PreviewGenerator {
  static async generatePreviewImage(annotationData) {
    // Create a canvas for generating preview images
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size (social media preview size)
    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, "#667eea");
    gradient.addColorStop(1, "#764ba2");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    // Wrap text function
    const wrapText = (text, x, y, maxWidth, lineHeight) => {
      const words = text.split(" ");
      let line = "";
      let lines = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      // Draw lines
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + i * lineHeight);
      }

      return lines.length;
    };

    // Draw title
    const title = annotationData.title || "Annotation Preview";
    wrapText(title, canvas.width / 2, 150, canvas.width - 200, 60);

    // Draw description
    ctx.font = "24px Inter, Arial, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    const description =
      annotationData.description || "Shared via Annotation Hub";
    wrapText(description, canvas.width / 2, 300, canvas.width - 200, 35);

    // Draw URL
    ctx.font = "18px Inter, Arial, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fillText("annotationhub.com", canvas.width / 2, 500);

    // Draw annotation icon
    ctx.font = "72px Arial";
    ctx.fillText("📋", canvas.width / 2, 50);

    // Convert to data URL
    return canvas.toDataURL("image/jpeg", 0.8);
  }
}
