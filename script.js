class AnnotationManager {
  constructor() {
    this.metadata = this.loadMetadata();
    this.init();
  }

  init() {
    // Set default expiry date to 7 days from now
    this.setDefaultExpiryDate();

    // Initialize event listeners
    this.setupDragAndDrop();
    this.setupFileInput();
    this.setupImageUpload(); // Add this line
    this.setupFormSubmit();
    console.log("Annotation Manager initialized");
  }

  setDefaultExpiryDate() {
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 7);
    document.getElementById("expiryDate").valueAsDate = defaultExpiry;
  }

  loadMetadata() {
    try {
      return JSON.parse(localStorage.getItem("annotationMetadata") || "{}");
    } catch (error) {
      console.error("Error loading metadata:", error);
      return {};
    }
  }

  saveMetadata() {
    try {
      localStorage.setItem("annotationMetadata", JSON.stringify(this.metadata));
    } catch (error) {
      console.error("Error saving metadata:", error);
    }
  }

  setupDragAndDrop() {
    const uploadArea = document.getElementById("uploadArea");
    const uploadContent = document.getElementById("uploadContent");
    const filePreview = document.getElementById("filePreview");

    // Prevent default drag behaviors
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Highlight drop area when item is dragged over it
    ["dragenter", "dragover"].forEach((eventName) => {
      uploadArea.addEventListener(
        eventName,
        () => {
          uploadArea.classList.add("drag-over");
        },
        false
      );
    });

    ["dragleave", "drop"].forEach((eventName) => {
      uploadArea.addEventListener(
        eventName,
        () => {
          uploadArea.classList.remove("drag-over");
        },
        false
      );
    });

    // Handle dropped files
    uploadArea.addEventListener(
      "drop",
      (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          this.handleFileSelection(files[0]);
        }
      },
      false
    );
  }

  setupFileInput() {
    const fileInput = document.getElementById("fileInput");
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.handleFileSelection(e.target.files[0]);
      }
    });
  }

  handleFileSelection(file) {
    if (!file.type.includes("html") && !file.name.endsWith(".html")) {
      this.showError("Please select an HTML file");
      return;
    }

    this.updateFilePreview(file);
  }

  updateFilePreview(file) {
    const uploadContent = document.getElementById("uploadContent");
    const filePreview = document.getElementById("filePreview");
    const fileName = document.getElementById("fileName");
    const fileSize = document.getElementById("fileSize");

    // Update file info
    fileName.textContent = file.name;
    fileSize.textContent = this.formatFileSize(file.size);

    // Show file preview and hide upload content
    uploadContent.style.display = "none";
    filePreview.style.display = "flex";
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  setupFormSubmit() {
    const form = document.getElementById("uploadForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleFileUpload();
    });
  }

  async generatePreviewMetadata(htmlContent, metadata) {
    // Extract title from HTML content
    const titleMatch =
      htmlContent.match(/<title>(.*?)<\/title>/i) ||
      htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i) ||
      htmlContent.match(/<h2[^>]*>(.*?)<\/h2>/i);

    const title = titleMatch
      ? titleMatch[1].replace(/<[^>]*>/g, "").trim()
      : metadata.originalName.replace(".html", "");

    // Extract description from content or use provided description
    const descMatch =
      htmlContent.match(/<meta name="description" content="(.*?)"/i) ||
      htmlContent.match(/<p[^>]*>(.*?)<\/p>/i);

    const description =
      metadata.description ||
      (descMatch
        ? descMatch[1].replace(/<[^>]*>/g, "").substring(0, 160) + "..."
        : "An annotated image shared via Annotation Hub");

    // Use static preview image
    const baseUrl = window.location.origin + window.location.pathname;
    const basePath = baseUrl.replace("index.html", "");
    const previewImageUrl = `${basePath}preview-image.jpg`;

    // Generate Open Graph meta tags
    const previewMetaTags = `
      <!-- Social Media Preview Tags -->
      <meta property="og:title" content="${this.escapeHtml(title)}">
      <meta property="og:description" content="${this.escapeHtml(description)}">
      <meta property="og:url" content="${metadata.publicUrl}">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="Annotation Hub">
      <meta property="og:image" content="${previewImageUrl}">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">

      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${this.escapeHtml(title)}">
      <meta name="twitter:description" content="${this.escapeHtml(
        description
      )}">
      <meta name="twitter:image" content="${previewImageUrl}">

      <meta name="description" content="${this.escapeHtml(description)}">
              `.trim();

    return { title, description, previewMetaTags, previewImageUrl };
  }

  escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  setupImageUpload() {
    const imageInput = document.getElementById("previewImage");
    const imageUploadArea = document.getElementById("imageUploadArea");
    const imageUploadContent = document.getElementById("imageUploadContent");
    const imagePreview = document.getElementById("imagePreview");

    // Drag and drop for images
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      imageUploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ["dragenter", "dragover"].forEach((eventName) => {
      imageUploadArea.addEventListener(
        eventName,
        () => {
          imageUploadArea.classList.add("drag-over");
        },
        false
      );
    });

    ["dragleave", "drop"].forEach((eventName) => {
      imageUploadArea.addEventListener(
        eventName,
        () => {
          imageUploadArea.classList.remove("drag-over");
        },
        false
      );
    });

    imageUploadArea.addEventListener(
      "drop",
      (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith("image/")) {
          this.handleImageSelection(files[0]);
        }
      },
      false
    );

    imageInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.handleImageSelection(e.target.files[0]);
      }
    });
  }

  handleImageSelection(file) {
    if (!file.type.startsWith("image/")) {
      this.showError("Please select an image file (JPG, PNG, WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showError("Image size should be less than 5MB");
      return;
    }

    this.updateImagePreview(file);
  }

  updateImagePreview(file) {
    const imageUploadContent = document.getElementById("imageUploadContent");
    const imagePreview = document.getElementById("imagePreview");
    const previewImageDisplay = document.getElementById("previewImageDisplay");
    const previewImageName = document.getElementById("previewImageName");
    const previewImageSize = document.getElementById("previewImageSize");

    // Update file info
    previewImageName.textContent = file.name;
    previewImageSize.textContent = this.formatFileSize(file.size);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImageDisplay.src = e.target.result;

      // Show image preview and hide upload content
      imageUploadContent.style.display = "none";
      imagePreview.style.display = "flex";
    };
    reader.readAsDataURL(file);
  }

  async handleFileUpload() {
    const fileInput = document.getElementById("fileInput");
    const expiryDate = document.getElementById("expiryDate").value;
    const customSlug = document.getElementById("customSlug").value;
    const description = document.getElementById("previewDescription").value;
    const previewImageInput = document.getElementById("previewImage");

    if (!fileInput.files.length) {
      this.showError("Please select an HTML file first");
      return;
    }

    const file = fileInput.files[0];

    if (!file.type.includes("html") && !file.name.endsWith(".html")) {
      this.showError("Please select an HTML file");
      return;
    }

    try {
      this.showLoading();

      const fileId = this.generateFileId();
      const folderName = customSlug || `annotation-${fileId}`;

      let fileContent = await this.readFileAsText(file);
      let previewImageData = null;
      let usesCustomImage = false;

      // Extract title from original content
      const title =
        this.extractTitle(fileContent) || file.name.replace(".html", "");

      // Handle preview image (custom or generated)
      if (previewImageInput.files.length > 0) {
        // Use custom uploaded image
        const imageFile = previewImageInput.files[0];
        previewImageData = await this.processCustomImage(imageFile);
        usesCustomImage = true;
      } else {
        // Generate default preview image
        previewImageData = await this.generatePreviewImage(title, description);
        usesCustomImage = false;
      }

      // Create the folder structure files
      await this.createAnnotationFiles(
        folderName,
        fileContent,
        previewImageData,
        {
          title: title,
          description: description,
          expiryDate: expiryDate,
          originalName: file.name,
          fileId: fileId,
          customSlug: customSlug,
          usesCustomImage: usesCustomImage,
        }
      );

      // Save metadata
      const metadata = {
        id: fileId,
        folderName: folderName,
        originalName: file.name,
        expiryDate: expiryDate,
        created: new Date().toISOString(),
        slug: customSlug || fileId,
        description: description,
        publicUrl: this.generatePublicUrl(folderName),
        fileSize: this.formatFileSize(file.size),
        usesCustomImage: usesCustomImage,
        hasPreview: true,
      };

      this.metadata[fileId] = metadata;
      this.saveMetadata();
      this.showSuccess(metadata, usesCustomImage);
    } catch (error) {
      console.error("Upload error:", error);
      this.showError("Error processing files: " + error.message);
    }
  }

  async processCustomImage(imageFile) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Use the original image dimensions - no forced resizing to 1200x630
        const originalWidth = img.width;
        const originalHeight = img.height;

        // Set canvas to original image size
        canvas.width = originalWidth;
        canvas.height = originalHeight;

        // Draw image directly without background or borders
        ctx.drawImage(img, 0, 0, originalWidth, originalHeight);

        // Convert to data URL with original quality
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        resolve({
          dataUrl: dataUrl,
          width: originalWidth,
          height: originalHeight,
        });
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });
  }

  calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {
      width: srcWidth * ratio,
      height: srcHeight * ratio,
    };
  }

  async showSuccess(metadata, usesCustomImage, imageData) {
    try {
      this.showLoading("Generating short URL...");

      // Generate short URL
      const shortUrl = await this.shortenUrl(metadata.publicUrl);

      // Update the UI with both URLs
      document.getElementById("shareableLink").value = shortUrl;
      document.getElementById("previewTitle").textContent =
        metadata.originalName.replace(".html", "");
      document.getElementById("previewDesc").textContent =
        metadata.description || "No description provided";
      document.getElementById("previewUrl").textContent = new URL(
        shortUrl
      ).hostname; // Show tinyurl.com

      // Show which URL is being used
      this.showUrlComparison(metadata.publicUrl, shortUrl);

      // Update custom image note if needed
      if (usesCustomImage) {
        this.showCustomImageNote();
      }

      // Show results and hide form
      document.getElementById("uploadForm").style.display = "none";
      document.getElementById("resultCard").style.display = "block";

      // Scroll to results
      document
        .getElementById("resultCard")
        .scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error generating short URL:", error);
      // Fallback to original URL
      this.showSuccessWithFallback(metadata, usesCustomImage, imageData);
    }
  }

  showUrlComparison(longUrl, shortUrl) {
    const comparisonHtml = `
        <div class="url-comparison">
            <div class="url-item">
                <label>Short URL (Recommended for sharing):</label>
                <div class="link-container">
                    <input type="text" value="${shortUrl}" class="link-input" readonly id="shortLink">
                    <button class="copy-btn" onclick="copyToClipboard('shortLink')">
                        <span class="btn-icon">📋</span>
                        Copy
                    </button>
                </div>
                <small>✅ Previews work perfectly • 🔗 Easy to share</small>
            </div>
            <div class="url-item">
                <label>Original URL:</label>
                <div class="link-container">
                    <input type="text" value="${longUrl}" class="link-input" readonly id="originalLink">
                    <button class="copy-btn" onclick="copyToClipboard('originalLink')">
                        <span class="btn-icon">📋</span>
                        Copy
                    </button>
                </div>
                <small>Use if short URL service is unavailable</small>
            </div>
        </div>
    `;

    // Replace the existing link section
    const linkSection = document.querySelector(".link-section");
    if (linkSection) {
      linkSection.innerHTML = comparisonHtml;
    }
  }

  showSuccessWithFallback(metadata, usesCustomImage, imageData) {
    // Fallback if TinyURL fails
    document.getElementById("shareableLink").value = metadata.publicUrl;
    document.getElementById("previewTitle").textContent =
      metadata.originalName.replace(".html", "");
    document.getElementById("previewDesc").textContent =
      metadata.description || "No description provided";
    document.getElementById("previewUrl").textContent = new URL(
      metadata.publicUrl
    ).hostname;

    if (usesCustomImage) {
      this.showCustomImageNote();
    }

    document.getElementById("uploadForm").style.display = "none";
    document.getElementById("resultCard").style.display = "block";
  }

  async shortenUrl(longUrl) {
    // Try multiple URL shortener services for reliability
    const services = [
      {
        name: "TinyURL",
        url: `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
          longUrl
        )}`,
      },
      {
        name: "is.gd",
        url: `https://is.gd/create.php?format=simple&url=${encodeURIComponent(
          longUrl
        )}`,
      },
    ];

    for (const service of services) {
      try {
        console.log(`Trying ${service.name}...`);
        const response = await fetch(service.url, {
          method: "GET",
          mode: "cors",
        });

        if (response.ok) {
          const shortUrl = await response.text();

          // Validate the response is actually a URL
          if (shortUrl && shortUrl.startsWith("http")) {
            console.log(`✅ Success with ${service.name}: ${shortUrl}`);
            return shortUrl;
          }
        }
      } catch (error) {
        console.warn(`${service.name} failed:`, error);
        continue; // Try next service
      }
    }

    // All services failed, return original URL
    console.warn("All URL shortener services failed, using original URL");
    return longUrl;
  }

  showCustomImageNote() {
    const note = document.createElement("div");
    note.className = "custom-image-note";
    note.innerHTML = `
            <div class="note-icon">🎯</div>
            <div class="note-content">
                <strong>Custom preview image included!</strong>
                <p>Your uploaded image will be used for social media previews.</p>
            </div>
        `;

    const resultCard = document.getElementById("resultCard");
    const firstSection = resultCard.querySelector(".success-header");
    resultCard.insertBefore(note, firstSection.nextSibling);
  }

  extractTitle(htmlContent) {
    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      return titleMatch[1].replace(/<[^>]*>/g, "").trim();
    }

    // Try to find h1 tag
    const h1Match = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match) {
      return h1Match[1].replace(/<[^>]*>/g, "").trim();
    }

    return null;
  }

  async generatePreviewImage(title, description) {
    return new Promise((resolve) => {
      // Use standard social media size but keep it clean
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext("2d");

      // Clean white background (no gradient)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add annotation icon with subtle color
      ctx.fillStyle = "#667eea";
      ctx.font = "bold 80px Arial";
      ctx.textAlign = "center";
      ctx.fillText("📋", canvas.width / 2, 150);

      // Add title
      ctx.font = 'bold 56px "Inter", Arial, sans-serif';
      ctx.fillStyle = "#333333";
      this.wrapText(ctx, title, canvas.width / 2, 250, canvas.width - 200, 65);

      // Add description
      if (description) {
        ctx.font = '32px "Inter", Arial, sans-serif';
        ctx.fillStyle = "#666666";
        this.wrapText(
          ctx,
          description,
          canvas.width / 2,
          380,
          canvas.width - 200,
          40
        );
      }

      // Add website URL
      ctx.font = '24px "Inter", Arial, sans-serif';
      ctx.fillStyle = "#999999";
      ctx.fillText("Annotation Hub", canvas.width / 2, 530);

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      resolve({
        dataUrl: dataUrl,
        width: 1200,
        height: 630,
      });
    });
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
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
      ctx.fillText(lines[i].trim(), x, y + i * lineHeight);
    }

    return lines;
  }

  async createAnnotationFiles(
    folderName,
    originalHtml,
    previewImageData,
    metadata
  ) {
    // Create enhanced HTML with proper meta tags and dynamic dimensions
    const enhancedHtml = this.createEnhancedHTML(
      originalHtml,
      folderName,
      metadata,
      {
        width: previewImageData.width,
        height: previewImageData.height,
      }
    );

    // Create a zip file with both files
    const zip = new JSZip();

    // Add the enhanced HTML file
    zip.file(`${folderName}/index.html`, enhancedHtml);

    // Convert data URL to blob and add preview image
    const previewBlob = this.dataURLtoBlob(previewImageData.dataUrl);
    zip.file(`${folderName}/preview.jpg`, previewBlob);

    // Create deployment instructions
    const instructions = this.createDeploymentInstructions(
      folderName,
      metadata,
      previewImageData
    );
    zip.file(`${folderName}/DEPLOYMENT.md`, instructions);

    // Generate and download zip
    const zipContent = await zip.generateAsync({ type: "blob" });
    this.downloadFile(`${folderName}.zip`, zipContent);

    // Show success message with important notes
    this.showDeploymentInstructions(folderName, previewImageData);
  }

  createDeploymentInstructions(folderName, metadata, imageData) {
    const publicUrl = this.generatePublicUrl(folderName);
    const imageType = metadata.usesCustomImage
      ? `Custom uploaded image (${imageData.width}×${imageData.height})`
      : "Automatically generated preview";

    return `# Deployment Instructions

      ## Your Annotation: ${metadata.originalName}

      ### Files to Upload:
      - \`index.html\` - Your annotation with social media tags
      - \`preview.jpg\` - ${imageType}

      ### Image Details:
      - **Dimensions:** ${imageData.width} × ${imageData.height} pixels
      - **Aspect Ratio:** ${this.calculateAspectRatio(
            imageData.width,
            imageData.height
          )}

      ### Important Note About URLs:
      After deployment, use the **short URL** provided in the application for sharing. 
      It will redirect to your annotation and social media previews will work perfectly!

      ### Folder Structure:
      \`\`\`
      your-repo/
      └── annotations/
          └── ${folderName}/
              ├── index.html
              └── preview.jpg
      \`\`\`

      ### Git Commands:
      \`\`\`bash
      # Navigate to your repository
      cd your-repo-name

      # Create the folder and add files
      mkdir -p annotations/${folderName}
      cp ${folderName}/* annotations/${folderName}/

      # Commit and push
      git add annotations/${folderName}/
      git commit -m "Add annotation: ${folderName}"
      git push origin main
      \`\`\`

      ### Your Annotation URL:
      ${publicUrl}

      ### After Deployment:
      1. Wait 5 minutes for GitHub Pages to update
      2. Use the short URL provided in the app for sharing
      3. Test with Facebook Debugger: https://developers.facebook.com/tools/debug/

      ### Testing Social Media Previews:
      - ✅ Title: Will show correctly
      - ✅ Description: Will show correctly  
      - ✅ Image: Will show correctly
      - ✅ Works with: Facebook, Twitter, WhatsApp, LinkedIn, Slack
      `;
  }

  calculateAspectRatio(width, height) {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  }

  showDeploymentInstructions(folderName, imageData) {
    const publicUrl = this.generatePublicUrl(folderName);

    const instructions = `
      🎉 **Annotation Generated Successfully!**

      **Image Details:**
      - Dimensions: ${imageData.width} × ${imageData.height} pixels
      - Aspect Ratio: ${this.calculateAspectRatio(
        imageData.width,
        imageData.height
      )}

      **Next Steps:**
      1. **Extract the downloaded zip file**
      2. **Upload to GitHub** using the commands in DEPLOYMENT.md
      3. **Wait 5 minutes** for GitHub Pages to update
      4. **Test your link:** ${publicUrl}
      5. **Test the preview image:** ${publicUrl}/preview.jpg

      **Important:** The preview will now show your image in its original aspect ratio.

      **Test your social media preview:**
      - Facebook: https://developers.facebook.com/tools/debug/
      - Twitter: https://cards-dev.twitter.com/validator/
          `;

    alert(instructions);
    console.log("Deployment instructions:", instructions);
  }

  createEnhancedHTML(originalHtml, folderName, metadata, imageDimensions) {
    const publicUrl = this.generatePublicUrl(folderName);

    // Extract the original title or use fallback
    const originalTitle = this.extractTitle(originalHtml) || metadata.title;

    // Create enhanced meta tags with dynamic dimensions
    const metaTags = `
      <!-- Social Media Preview Tags -->
      <meta property="og:title" content="${this.escapeHtml(originalTitle)}">
      <meta property="og:description" content="${this.escapeHtml(
        metadata.description || "An annotated image"
      )}">
      <meta property="og:url" content="${publicUrl}">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="Annotation Hub">
      <meta property="og:image" content="${publicUrl}/preview.jpg">
      <meta property="og:image:width" content="${imageDimensions.width}">
      <meta property="og:image:height" content="${imageDimensions.height}">

      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${this.escapeHtml(originalTitle)}">
      <meta name="twitter:description" content="${this.escapeHtml(
        metadata.description || "An annotated image"
      )}">
      <meta name="twitter:image" content="${publicUrl}/preview.jpg">

      <meta name="description" content="${this.escapeHtml(
        metadata.description || "An annotated image"
      )}">
          `.trim();

    // ... rest of the method remains the same ...
    let enhancedHtml = originalHtml;

    // Remove existing meta tags to avoid duplicates
    enhancedHtml = enhancedHtml
      .replace(/<meta property="og:[^>]*>/gi, "")
      .replace(/<meta name="twitter:[^>]*>/gi, "")
      .replace(/<meta name="description"[^>]*>/gi, "");

    // Check if there's a head section
    if (enhancedHtml.includes("</head>")) {
      // Insert before closing head tag
      enhancedHtml = enhancedHtml.replace(
        /<\/head>/i,
        `\n${metaTags}\n</head>`
      );
    } else if (enhancedHtml.includes("<head>")) {
      // Insert after opening head tag
      enhancedHtml = enhancedHtml.replace(/<head>/i, `<head>\n${metaTags}`);
    } else {
      // Create head section at the beginning
      enhancedHtml = `<!DOCTYPE html>\n<html>\n<head>\n${metaTags}\n</head>\n${enhancedHtml}`;
    }

    return enhancedHtml;
  }

  dataURLtoBlob(dataURL) {
    // Handle both string dataURL and object with dataUrl property
    const actualDataURL =
      typeof dataURL === "string" ? dataURL : dataURL.dataUrl;

    const byteString = atob(actualDataURL.split(",")[1]);
    const mimeString = actualDataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  createInstructions(folderName, metadata) {
    return `# Annotation: ${metadata.originalName}

      ## Files Included:
      - \`index.html\` - Your annotation file with social media meta tags
      - \`preview.jpg\` - Generated preview image for social sharing

      ## Deployment Steps:

      1. **Extract the zip file**
      2. **Upload to your GitHub repository:**
        \`\`\`bash
        # Create the folder structure
        mkdir -p annotations/${folderName}
        
        # Copy the extracted files
        cp ${folderName}/* annotations/${folderName}/
        
        # Add to git
        git add annotations/${folderName}/
        
        # Commit
        git commit -m "feat: add annotation ${folderName}"
        
        # Push to GitHub
        git push origin main
        \`\`\`

      3. **Your annotation will be live at:**
        ${this.generatePublicUrl(folderName)}

      4. **Test the social media preview:**
        - Share the link on WhatsApp, Twitter, or Facebook
        - It should show the title, description, and preview image
        - Use Facebook Sharing Debugger to test: https://developers.facebook.com/tools/debug/
      `;
  }

  async extractFirstImage(htmlContent, folderName) {
    try {
      // Parse HTML to find images
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");

      // Look for images in this order: img tags, canvas elements, background images
      const imgTags = doc.querySelectorAll("img[src]");

      for (let img of imgTags) {
        const src = img.getAttribute("src");

        // Skip data URLs and external URLs for now
        if (src.startsWith("data:") || src.startsWith("http")) {
          continue;
        }

        // If it's a relative path, we'll handle it in the packaging
        if (!src.startsWith("http")) {
          return {
            originalSrc: src,
            type: "relative",
            fileName: this.getFileNameFromPath(src),
          };
        }
      }

      // If no suitable images found, return null
      return null;
    } catch (error) {
      console.warn("Error extracting image:", error);
      return null;
    }
  }

  getFileNameFromPath(path) {
    return path.split("/").pop().split("?")[0];
  }

  generateEnhancedHTML(originalContent, metadata, imageData) {
    // Extract title from original content
    const titleMatch =
      originalContent.match(/<title>(.*?)<\/title>/i) ||
      originalContent.match(/<h1[^>]*>(.*?)<\/h1>/i);

    const title = titleMatch
      ? titleMatch[1].replace(/<[^>]*>/g, "").trim()
      : metadata.originalName.replace(".html", "");

    const description =
      metadata.description || "An annotated image shared via Annotation Hub";

    // Generate preview image URL
    const previewImageUrl = imageData
      ? `${this.generatePublicUrl(metadata.folderName)}/preview.jpg`
      : `${window.location.origin}${window.location.pathname.replace(
          "index.html",
          ""
        )}preview-image.jpg`;

    const metaTags = `
      <!-- Social Media Preview Tags -->
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${this.escapeHtml(title)}</title>
      <meta name="description" content="${this.escapeHtml(description)}">

      <!-- Open Graph Meta Tags -->
      <meta property="og:title" content="${this.escapeHtml(title)}">
      <meta property="og:description" content="${this.escapeHtml(description)}">
      <meta property="og:url" content="${metadata.publicUrl}">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="Annotation Hub">
      <meta property="og:image" content="${previewImageUrl}">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">

      <!-- Twitter Card Meta Tags -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${this.escapeHtml(title)}">
      <meta name="twitter:description" content="${this.escapeHtml(
        description
      )}">
      <meta name="twitter:image" content="${previewImageUrl}">
              `.trim();

    // Inject meta tags into the original HTML
    let enhancedContent = originalContent;

    // Remove existing head content and replace with our enhanced version
    const headMatch = enhancedContent.match(/<head[^>]*>[\s\S]*?<\/head>/i);
    if (headMatch) {
      enhancedContent = enhancedContent.replace(
        /<head[^>]*>[\s\S]*?<\/head>/i,
        `<head>\n${metaTags}\n</head>`
      );
    } else {
      // No head tag found, insert at beginning
      enhancedContent = `<head>\n${metaTags}\n</head>\n${enhancedContent}`;
    }

    return enhancedContent;
  }

  async createAnnotationPackage(folderName, htmlContent, imageData, metadata) {
    // Create a zip file using JSZip
    const zip = new JSZip();

    // Add the HTML file
    zip.file(`${folderName}/index.html`, htmlContent);

    // Add instructions file
    const instructions = this.createInstructionsFile(metadata);
    zip.file(`${folderName}/README.md`, instructions);

    // Create the zip file
    const zipContent = await zip.generateAsync({ type: "blob" });

    // Download the zip file
    this.downloadZipFile(zipContent, `${folderName}.zip`);

    // Show instructions for manual image handling
    if (imageData) {
      this.showImageInstructions(folderName, imageData);
    }
  }

  createInstructionsFile(metadata) {
    return `# Annotation: ${metadata.originalName}

      ## Files to Upload to GitHub:

      1. **${metadata.folderName}/index.html** - The main annotation file
      2. **${metadata.folderName}/preview.jpg** - Preview image (see instructions below)

      ## GitHub Commands:

      \`\`\`bash
      # Create the folder
      mkdir annotations/${metadata.folderName}

      # Add all files
      git add annotations/${metadata.folderName}/

      # Commit changes
      git commit -m "feat: add annotation ${metadata.folderName}"

      # Push to GitHub
      git push origin main
      \`\`\`

      ## Public URL:
      ${metadata.publicUrl}

      ## Preview Image Setup:
      1. Take a screenshot of your annotation
      2. Save it as 'preview.jpg' 
      3. Place it in the '${metadata.folderName}' folder
      4. The image should be 1200x630 pixels for best results
      `;
  }

  showImageInstructions(folderName, imageData) {
    const instructions = `
      ## Important: Preview Image Setup

      To enable image previews when sharing your link:

      1. **Extract the image from your original files:**
        - Look for: ${imageData.originalSrc}
        - Save it as: \`preview.jpg\`

      2. **Create the folder structure:**
      \`\`\`
      annotations/
      └── ${folderName}/
          ├── index.html
          └── preview.jpg
      \`\`\`

      3. **Upload to GitHub:**
      \`\`\`bash
      git add annotations/${folderName}/
      git commit -m "feat: add ${folderName} with preview"
      git push
      \`\`\`

      The image preview will work once you've added the preview.jpg file!
        `;

    // You could show this in a modal or alert
    console.log(instructions);
    alert(
      "Check the console for important instructions about setting up the preview image!"
    );
  }

  downloadZipFile(zipContent, fileName) {
    const url = URL.createObjectURL(zipContent);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  generatePublicUrl(folderName) {
    const baseUrl = window.location.origin + window.location.pathname;
    const basePath = baseUrl.replace("index.html", "");
    // FIXED: Ensure it ends with slash for folder structure
    return `${basePath}annotations/${folderName}/`;
  }

  injectMetaTags(originalContent, previewData, metadata) {
    // Remove existing meta tags to avoid duplicates
    let content = originalContent
      .replace(/<meta property="og:[^>]*>/gi, "")
      .replace(/<meta name="twitter:[^>]*>/gi, "")
      .replace(/<meta name="description"[^>]*>/gi, "");

    // Find the head tag and insert meta tags
    const headEndMatch = content.match(/<\/head>/i);

    if (headEndMatch) {
      // Insert before closing head tag
      content = content.replace(
        /<\/head>/i,
        `\n${previewData.previewMetaTags}\n</head>`
      );
    } else {
      // No head tag found, create one
      const bodyMatch = content.match(/<body>/i);
      if (bodyMatch) {
        content = content.replace(
          /<body>/i,
          `<head>\n${previewData.previewMetaTags}\n</head>\n<body>`
        );
      } else {
        content = `<head>\n${previewData.previewMetaTags}\n</head>\n` + content;
      }
    }

    // Ensure there's a title tag
    if (!content.includes("<title>")) {
      const headMatch = content.match(/<head>/i);
      if (headMatch) {
        content = content.replace(
          /<head>/i,
          `<head>\n<title>${previewData.title}</title>`
        );
      }
    }

    return content;
  }

  generateFileId() {
    return (
      Math.random().toString(36).substring(2, 10) +
      Math.random().toString(36).substring(2, 10)
    );
  }

  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  downloadFile(filename, content) {
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  generatePublicUrl(fileName) {
    const baseUrl = window.location.origin + window.location.pathname;
    const basePath = baseUrl.replace("index.html", "");
    return `${basePath}annotations/${fileName}`;
  }

  showLoading(message = "Processing file...") {
    // Create or show loading message
    let loadingElement = document.getElementById("loadingMessage");
    if (!loadingElement) {
      loadingElement = document.createElement("div");
      loadingElement.id = "loadingMessage";
      loadingElement.className = "loading-message";
      document.querySelector(".upload-form").appendChild(loadingElement);
    }

    loadingElement.innerHTML = `
        <div class="spinner"></div>
        ${message}
    `;
    loadingElement.style.display = "block";
  }

  hideLoading() {
    const loadingElement = document.getElementById("loadingMessage");
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
  }

  showError(message) {
    alert("Error: " + message);
  }
}

// Global functions
function copyToClipboard(elementId) {
  const input = document.getElementById(elementId);
  input.select();
  input.setSelectionRange(0, 99999);

  navigator.clipboard
    .writeText(input.value)
    .then(() => {
      const btn = input.nextElementSibling;
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="btn-icon">✅</span> Copied!';
      btn.style.background = "#10b981";

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = "";
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

function copyLink() {
  copyToClipboard("shortLink");
}

function toggleGitCommands() {
  const gitCommands = document.getElementById("gitCommands");
  const isVisible = gitCommands.style.display !== "none";
  gitCommands.style.display = isVisible ? "none" : "block";
}

function resetForm() {
  // Reset form and show upload interface again
  document.getElementById("uploadForm").reset();
  document.getElementById("uploadForm").style.display = "block";
  document.getElementById("resultCard").style.display = "none";

  // Reset file preview
  document.getElementById("uploadContent").style.display = "block";
  document.getElementById("filePreview").style.display = "none";

  // Reset default expiry date
  annotationManager.setDefaultExpiryDate();
}

function openFileManager() {
  window.open("manager.html", "_blank");
}

function testLink() {
  const link = document.getElementById("shareableLink").value;
  if (link) {
    window.open(link, "_blank");
  } else {
    alert("No link available to test");
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.annotationManager = new AnnotationManager();
});
