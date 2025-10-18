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

  async handleFileUpload() {
    const fileInput = document.getElementById("fileInput");
    const expiryDate = document.getElementById("expiryDate").value;
    const customSlug = document.getElementById("customSlug").value;
    const description = document.getElementById("previewDescription").value;

    // Validate file selection
    if (!fileInput.files.length) {
      this.showError("Please select a file first");
      return;
    }

    const file = fileInput.files[0];

    // Validate file type
    if (!file.type.includes("html") && !file.name.endsWith(".html")) {
      this.showError("Please select an HTML file");
      return;
    }

    // Validate expiry date
    if (new Date(expiryDate) < new Date()) {
      this.showError("Expiry date must be in the future");
      return;
    }

    try {
      this.showLoading();

      const fileId = this.generateFileId();
      const fileName = customSlug
        ? `${customSlug}.html`
        : `annotation-${fileId}.html`;

      const fileContent = await this.readFileAsText(file);

      // Download the file to user's computer
      this.downloadFile(fileName, fileContent);

      // Generate public URL
      const publicUrl = this.generatePublicUrl(fileName);

      // Save metadata
      this.metadata[fileId] = {
        id: fileId,
        fileName: fileName,
        originalName: file.name,
        expiryDate: expiryDate,
        created: new Date().toISOString(),
        slug: customSlug || fileId,
        description:
          description ||
          `Annotation created on ${new Date().toLocaleDateString()}`,
        publicUrl: publicUrl,
        fileSize: this.formatFileSize(file.size),
      };

      this.saveMetadata();
      this.showSuccess(this.metadata[fileId]);
    } catch (error) {
      console.error("Upload error:", error);
      this.showError("Error processing file: " + error.message);
    }
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

  downloadFile(fileName, content) {
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
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

  showLoading() {
    // You can add a loading spinner here
    console.log("Processing file...");
  }

  showSuccess(metadata) {
    // Update the UI with success information
    document.getElementById("shareableLink").value = metadata.publicUrl;
    document.getElementById("previewTitle").textContent =
      metadata.originalName.replace(".html", "");
    document.getElementById("previewDesc").textContent =
      metadata.description || "No description provided";
    document.getElementById("previewUrl").textContent = new URL(
      metadata.publicUrl
    ).hostname;

    // Show results and hide form
    document.getElementById("uploadForm").style.display = "none";
    document.getElementById("resultCard").style.display = "block";

    // Scroll to results
    document
      .getElementById("resultCard")
      .scrollIntoView({ behavior: "smooth" });
  }

  showError(message) {
    alert("Error: " + message);
  }
}

// Global functions
function copyLink() {
  const linkInput = document.getElementById("shareableLink");
  linkInput.select();
  linkInput.setSelectionRange(0, 99999);

  navigator.clipboard
    .writeText(linkInput.value)
    .then(() => {
      const btn = document.querySelector(".copy-btn");
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
