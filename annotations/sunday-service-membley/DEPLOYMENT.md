# Deployment Instructions

      ## Your Annotation: Sunday Service (1).html

      ### Files to Upload:
      - `index.html` - Your annotation with social media tags
      - `preview.jpg` - Custom uploaded image (1331×1440)

      ### Image Details:
      - **Dimensions:** 1331 × 1440 pixels
      - **Aspect Ratio:** 1331:1440

      ### Important Note About URLs:
      After deployment, use the **short URL** provided in the application for sharing. 
      It will redirect to your annotation and social media previews will work perfectly!

      ### Folder Structure:
      ```
      your-repo/
      └── annotations/
          └── sunday-service-membley/
              ├── index.html
              └── preview.jpg
      ```

      ### Git Commands:
      ```bash
      # Navigate to your repository
      cd your-repo-name

      # Create the folder and add files
      mkdir -p annotations/sunday-service-membley
      cp sunday-service-membley/* annotations/sunday-service-membley/

      # Commit and push
      git add annotations/sunday-service-membley/
      git commit -m "Add annotation: sunday-service-membley"
      git push origin main
      ```

      ### Your Annotation URL:
      https://kinyuajohn.github.io/annotation-hub/annotations/sunday-service-membley/

      ### After Deployment:
      1. Wait 5 minutes for GitHub Pages to update
      2. Use the short URL provided in the app for sharing
      3. Test with Facebook Debugger: https://developers.facebook.com/tools/debug/

      ### Testing Social Media Previews:
      - ✅ Title: Will show correctly
      - ✅ Description: Will show correctly  
      - ✅ Image: Will show correctly
      - ✅ Works with: Facebook, Twitter, WhatsApp, LinkedIn, Slack
      