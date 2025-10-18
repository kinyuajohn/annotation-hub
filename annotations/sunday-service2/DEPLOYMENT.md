# Deployment Instructions

    ## Your Annotation: Sunday Service.html

    ### Files to Upload:
    - `index.html` - Your annotation with social media tags
    - `preview.jpg` - Custom uploaded image

    ### Preview Image:
    ✅ Using your custom uploaded image for social media previews

    ### Folder Structure on GitHub:
    ```
    your-repo/
    └── annotations/
        └── sunday-service2/
            ├── index.html
            └── preview.jpg
    ```

    ### Git Commands:
    ```bash
    # Navigate to your repository
    cd your-repo-name

    # Create the folder and add files
    mkdir -p annotations/sunday-service2
    cp sunday-service2/* annotations/sunday-service2/

    # Commit and push
    git add annotations/sunday-service2/
    git commit -m "Add annotation: sunday-service2"
    git push origin main
    ```

    ### Your Annotation URL:
    https://kinyuajohn.github.io/annotation-hub/annotations/sunday-service2

    ### Preview Image URL:
    https://kinyuajohn.github.io/annotation-hub/annotations/sunday-service2preview.jpg

    ### Test Social Media Preview:
    1. Wait 5 minutes after pushing to GitHub
    2. Share: https://kinyuajohn.github.io/annotation-hub/annotations/sunday-service2
    3. Test with Facebook Debugger: https://developers.facebook.com/tools/debug/
    