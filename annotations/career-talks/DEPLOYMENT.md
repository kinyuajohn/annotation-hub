# Deployment Instructions

      ## Your Annotation: Career Talks (1).html

      ### Files to Upload:
      - `index.html` - Your annotation with social media tags
      - `preview.jpg` - Custom uploaded image (2250×2250)

      ### Image Details:
      - **Dimensions:** 2250 × 2250 pixels
      - **Aspect Ratio:** 1:1

      ### Important Note About URLs:
      After deployment, use the **short URL** provided in the application for sharing. 
      It will redirect to your annotation and social media previews will work perfectly!

      ### Folder Structure:
      ```
      your-repo/
      └── annotations/
          └── career-talks/
              ├── index.html
              └── preview.jpg
      ```

      ### Git Commands:
      ```bash
      # Navigate to your repository
      cd your-repo-name

      # Create the folder and add files
      mkdir -p annotations/career-talks
      cp career-talks/* annotations/career-talks/

      # Commit and push
      git add annotations/career-talks/
      git commit -m "Add annotation: career-talks"
      git push origin main
      ```

      ### Your Annotation URL:
      https://kinyuajohn.github.io/annotation-hub/annotations/career-talks/

      ### After Deployment:
      1. Wait 5 minutes for GitHub Pages to update
      2. Use the short URL provided in the app for sharing
      3. Test with Facebook Debugger: https://developers.facebook.com/tools/debug/

      ### Testing Social Media Previews:
      - ✅ Title: Will show correctly
      - ✅ Description: Will show correctly  
      - ✅ Image: Will show correctly
      - ✅ Works with: Facebook, Twitter, WhatsApp, LinkedIn, Slack
      