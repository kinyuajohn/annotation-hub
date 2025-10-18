# Deployment Instructions

      ## Your Annotation: Sunday Service.html

      ### Files to Upload:
      - `index.html` - Your annotation with social media tags
      - `preview.jpg` - Custom uploaded image (736×920)

      ### Image Details:
      - **Dimensions:** 736 × 920 pixels
      - **Aspect Ratio:** 4:5

      ### Important Note About URLs:
      After deployment, use the **short URL** provided in the application for sharing. 
      It will redirect to your annotation and social media previews will work perfectly!

      ### Folder Structure:
      ```
      your-repo/
      └── annotations/
          └── testing-tinyurl/
              ├── index.html
              └── preview.jpg
      ```

      ### Git Commands:
      ```bash
      # Navigate to your repository
      cd your-repo-name

      # Create the folder and add files
      mkdir -p annotations/testing-tinyurl
      cp testing-tinyurl/* annotations/testing-tinyurl/

      # Commit and push
      git add annotations/testing-tinyurl/
      git commit -m "Add annotation: testing-tinyurl"
      git push origin main
      ```

      ### Your Annotation URL:
      https://kinyuajohn.github.io/annotation-hub/annotations/testing-tinyurl

      ### After Deployment:
      1. Wait 5 minutes for GitHub Pages to update
      2. Use the short URL provided in the app for sharing
      3. Test with Facebook Debugger: https://developers.facebook.com/tools/debug/

      ### Testing Social Media Previews:
      - ✅ Title: Will show correctly
      - ✅ Description: Will show correctly  
      - ✅ Image: Will show correctly
      - ✅ Works with: Facebook, Twitter, WhatsApp, LinkedIn, Slack
      