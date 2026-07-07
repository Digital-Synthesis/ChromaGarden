export const manualContent = [
    // ============================================================
  // CHAPTER 1 - INTRODUCTION
  // ============================================================
    {
        id: 1,
        title: "1. Introduction",
        content: `
      <h2>1. Introduction</h2>
      <h3>1.1 What Is Chroma Garden?</h3>
      <p>Chroma Garden is a desktop color-grading workstation designed for photographers, filmmakers, and creative professionals who want fast, intelligent, season-aware color grades.</p>
      <p>The app analyzes your photo's luminance, tone distribution, color cast, saturation, edge density, and skin content — then generates creative grades tailored to that specific image through a curated set of seasonal, black & white, and portrait profiles.</p>
      <p>Rather than adjusting sliders from scratch, you start with an engine-generated recipe and refine from there — or explore nine variations at once, lock the ones you like, and promote your favorite to the main workspace. Every grade produced is adapted to the actual image data, meaning the same profile on two different photos will yield meaningfully different results.</p>

      <h3>1.2 The Creative Philosophy</h3>
      <p>Not every photo will look fantastic with every profile — and not every profile will look fantastic with every photo. This is intentional. The recipe math inside each personality is designed around specific color science principles, not universal image correction. Because every photograph is different in its luminance distribution, color cast, tonal balance, and subject matter, a personality that falls flat on one image may be exactly right for another. This is not a limitation of the engine — it is the engine working as designed.</p>
      <p>Exploration and experimentation are a core part of the Chroma Garden workflow. Switching seasons, trying a different personality, or pressing Randomize a few more times is not troubleshooting — it is the creative process. The engine gives you the raw material; your eye and your willingness to explore determine the outcome.</p>
      <p>It is also worth understanding why many of the base recipe jitters — the randomized values generated on each pass — are kept deliberately lower and less aggressive by default. Color grading, at its foundation, is the art of layering subtle adjustments on top of one another. No single slider, curve, or parameter tells the whole story. It is the cumulative effect of many small, considered moves — each one barely perceptible in isolation — that creates something profoundly different from the original starting point. Chroma Garden is built around this principle. The recipe gives you a thoughtful starting direction. The adjustments, tweaks, and drama controls let you stack your own subtle decisions on top of it — and that stack, built carefully, is where a truly unique grade lives.</p>
      <h3>1.3  What This Manual Covers</h3>
      <p>This manual covers every feature currently in Chroma Garden v0.1.0, including:</p>
     ●	Loading images into the workspace<br>
     ●	Working with seasonal, black & white, and portrait profiles<br>
     ●	Generating and exploring creative looks with Randomize and Explore 9<br>
     ●	Fine-tuning grades with Adjustments and Manual Tweaks<br>
     ●	Using Pre-Drama and Post-Drama to control generation variance and intensity<br>
     ●	Saving grades to your personal My Looks library and applying them to new images<br>
     ●	Exporting finished images at full original resolution<br>
     ●	Understanding the four-layer grading stack and how resets work
     <div style="background-color: #0f3d2a; border: 1px solid #1f5c44; border-radius: 8px; padding: 16px; margin: 20px 0; display: flex; align-items: flex-start; gap: 12px;">
     <div style="background-color: #1f5c44; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: bold; font-size: 15px;">
        i
     </div>
     <div>
     <h4 style="margin: 0 0 8px 0; color: white; font-size: 1.1em; text-decoration: underline;">For New Users</h4>
     <p style="margin: 0; color: #e0f2eb; line-height: 1.5;">
      If you are new to Chroma Garden, start with Chapter 3 (Loading an Image), then Chapter 5 (Color Profiles Tab) and Chapter 11 (Typical Workflows) to get productive quickly.
     </p>
     </div>
     </div>
      <!-- Full text of 1.2 and 1.3 can be expanded if you want, but this gives you the idea -->
    `
    },
    // ============================================================
  // CHAPTER 2 - Installation Instructions
  // ============================================================
    {
        id: 2,
        title: "2. Installation Instructions",
        content: `
      <h2>2. Installation Instructions</h2>
      <h3>2.1 How to Install</h3>
      <ol>
        <li>Download the latest version of Chroma Garden (.msi installer) from the official distribution location.</li>
        <li>Double-click the downloaded .msi file to start the installer.</li>
        <li>Follow the on-screen instructions to complete installation.</li>
        <li>Once finished, launch the application from the Start Menu or the desktop shortcut.</li>
      </ol>
      <h3>2.2 First-Time Launch</h3>
      <p>On first launch, the application may display a prompt to install Microsoft Edge WebView2 if it is not already present on your system. - Click Install when prompted. The process is fully automatic and only needs to be done once.  After WebView2 is installed, the app will launch normally.</p>
    <h3>2.3 About WebView2</h3>
    <p>WebView2 is a Microsoft system component required for the user interface. It is pre-installed on all modern Windows 10 (version 1803 and later) and Windows 11 systems. The installer will handle this automatically if needed. No internet connection is required after the initial installation.</p>
    `
    },
    // ============================================================
  // CHAPTER 3 - System Requirements
  // ============================================================
        {
        id: 3,
        title: "3.  System Requirements",
        content: `
        <h2>3.  System Requirements</h2>
        <p>Chroma Garden is a native desktop application built with Tauri and React. On Windows, Tauri renders the application interface using Microsoft Edge WebView2 — a system component pre-installed on Windows 10 version 1803 and all later versions of Windows, including Windows 11. The app runs as a compiled 64-bit native binary and performs all image processing locally through a background worker. No internet connection is required to run the application.</p>
      <h3>3.1  Minimum Requirements</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
  <thead>
    <tr style="background-color: #0d2b3d;">
      <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff; font-weight: 600;">Component</th>
      <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff; font-weight: 600;">Minimum Specification</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px 16px; color: #ccc;">Operating System</td>
      <td style="padding: 12px 16px; color: #ddd;">Windows 10 version 1803 (Build 17134 — April 2018 Update) or later, 64-bit</td>
    </tr>
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px 16px; color: #ccc;">Processor</td>
      <td style="padding: 12px 16px; color: #ddd;">Dual-core x64 (64-bit) processor, 1.5 GHz or faster</td>
    </tr>
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px 16px; color: #ccc;">Memory (RAM)</td>
      <td style="padding: 12px 16px; color: #ddd;">4 GB</td>
    </tr>
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px 16px; color: #ccc;">Storage</td>
      <td style="padding: 12px 16px; color: #ddd;">200 MB available disk space (application and app data)</td>
    </tr>
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px 16px; color: #ccc;">Display</td>
      <td style="padding: 12px 16px; color: #ddd;">1280 × 720 resolution</td>
    </tr>
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px 16px; color: #ccc;">Runtime</td>
      <td style="padding: 12px 16px; color: #ddd;">Microsoft Edge WebView2 (pre-installed on Windows 10 v1803+ and Windows 11)</td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; color: #ccc;">Internet</td>
      <td style="padding: 12px 16px; color: #ddd;">Not required — the application runs fully offline</td>
    </tr>
  </tbody>
</table>

      <h3>3.2  Recommended Requirements</h3>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
  <thead>
    <tr style="background-color: #0d2b3d;">
      <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff; font-weight: 600;">Component</th>
      <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff; font-weight: 600;">Minimum Specification</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px 16px; color: #ccc;">Operating System</td>
      <td style="padding: 12px 16px; color: #ddd;">Windows 10 21H2 or Windows 11, 64-bit</td>
    </tr>
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px 16px; color: #ccc;">Processor</td>
      <td style="padding: 12px 16px; color: #ddd;">Quad-core x64 processor, 2.5 GHz or faster</td>
    </tr>
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px 16px; color: #ccc;">Memory (RAM)</td>
      <td style="padding: 12px 16px; color: #ddd;">8 GB or more (particularly when working with large, high-resolution source images)</td>
    </tr>
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px 16px; color: #ccc;">Storage</td>
      <td style="padding: 12px 16px; color: #ddd;">1 GB or more available disk space (to accommodate saved looks, thumbnails, and a working image library)</td>
    </tr>
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px 16px; color: #ccc;">Display</td>
      <td style="padding: 12px 16px; color: #ddd;">1920 × 1080 or higher; IPS panel or equivalent with good color accuracy recommended for evaluating grades</td>
    </tr>
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px 16px; color: #ccc;">Runtime</td>
      <td style="padding: 12px 16px; color: #ddd;">Dedicated GPU with up-to-date drivers (improves UI rendering and WebView2 compositing performance)</td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; color: #ccc;">Internet</td>
      <td style="padding: 12px 16px; color: #ddd;">Not required — the application runs fully offline</td>
    </tr>
  </tbody>
</table>

     <div style="background-color: #0f3d2a; border: 1px solid #1f5c44; border-radius: 8px; padding: 16px; margin: 20px 0; display: flex; align-items: flex-start; gap: 12px;">
     <div style="background-color: #1f5c44; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: bold; font-size: 15px;">
        i
     </div>
     <div>
     <h4 style="margin: 0 0 8px 0; color: white; font-size: 1.1em; text-decoration: underline;">Note</h4>
     <p style="margin: 0; color: #e0f2eb; line-height: 1.5;">
      WebView2 is pre-installed on all fully updated Windows 10 systems (version 1803 and later) and ships built-in with Windows 11. If WebView2 is not present on your system, the application installer will prompt you to download and install it automatically. No manual setup is required.
     </p>
     </div>
     </div>
    `
    },
    // ============================================================
  // CHAPTER 4 - Workspace Overview
  // ============================================================
    {
    id: 4,
    title: "4. Workspace Overview",
    content: `
      <h2>4. Workspace Overview</h2>

      <h3>4.1 The Three-Panel Layout + Header</h3>
      <p>Chroma Garden uses a three-panel layout with a persistent header across the top. Every core function is accessible from one of these four areas without navigating away from the main workspace.</p>

      <p>The four areas and their roles are summarized below:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Area</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Label in App</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Header</td>
            <td style="padding: 12px 16px; color: #ddd;">Chroma Garden</td>
            <td style="padding: 12px 16px; color: #ddd;">Displays the app title. The badge on the right of the header shows the current operational mode: Color Grading Engine, Variations Grid, or Settings.</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left Panel</td>
            <td style="padding: 12px 16px; color: #ddd;">Workspace Controls</td>
            <td style="padding: 12px 16px; color: #ddd;">Contains the Color Profiles tab (profiles, Randomize, Explore 9, Pre-Drama, My Looks library) and the Adjustments tab (all fine-tuning sliders and Reset All).</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Center</td>
            <td style="padding: 12px 16px; color: #ddd;">Preview Workspace</td>
            <td style="padding: 12px 16px; color: #ddd;">Main image display area. Supports single view, split view, image upload (click or drag-and-drop), rotation mode, and access to Settings.</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Right Panel</td>
            <td style="padding: 12px 16px; color: #ddd;">Output &amp; Data</td>
            <td style="padding: 12px 16px; color: #ddd;">Contains two tabs: <strong>Data &amp; Tweaks</strong> (image analysis, recipe data, Post-Drama, Manual Tweaks, grade selection in grid mode) and <strong>Exports</strong> (Save / Export and Save Look).</td>
          </tr>
        </tbody>
      </table>

      <h3>4.2 Header Mode Badge</h3>
      <p>The badge displayed in the header updates automatically as you navigate the application, giving you a persistent reminder of the current operational context:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Badge Text</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">When It Appears</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Color Grading Engine</td>
            <td style="padding: 12px 16px; color: #ddd;">Default state — single-image grading mode is active</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Variations Grid</td>
            <td style="padding: 12px 16px; color: #ddd;">Explore 9 Looks is running or the 3×3 grid is displayed</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Settings</td>
            <td style="padding: 12px 16px; color: #ddd;">The Settings overlay is open</td>
          </tr>
        </tbody>
      </table>
    `
  },
    // ============================================================
  // CHAPTER 5 - Loading an Image
  // ============================================================
  {
    id: 5,
    title: "5. Loading an Image",
    content: `
      <h2>5. Loading an Image</h2>

      <h3>5.1 How to Load</h3>
      <p>There are two ways to load an image into Chroma Garden:</p>

      <ol>
        <li><strong>Click the preview area</strong> (when empty) — opens a native file picker dialog. When no image is loaded, the center preview displays the prompt "Click or Drop an Image Here."</li>
        <li><strong>Drag and drop</strong> — drag any supported image file directly onto the preview frame from your file explorer or desktop.</li>
      </ol>

      <p><strong>Supported Image Formats:</strong> JPEG (.jpg, .jpeg), PNG, TIFF, WebP, BMP, GIF<br>
      <strong>Note:</strong> RAW photo formats (.CR2, .NEF, .ARW, .DNG, etc.) are not supported in version 0.1.0.</p>

      <h3>5.2 What Happens When an Image Loads</h3>
      <p>When a new image is loaded, the app performs the following automatically:</p>

      <ul>
        <li><strong>Automatic image analysis</strong> — a one-time read of the original image measuring brightness, color cast, saturation, edge density, and skin detection. This data is used to adapt all subsequently generated recipes to that specific image.</li>
        <li><strong>Full state reset</strong> — all previous grading state is cleared: adjustments, manual tweaks, recipes, rotation, and My Look selections all reset to default.</li>
        <li><strong>Preview scaling</strong> — the image is scaled for display performance (maximum approximately 1,600 px on the longest side). Export always uses the full original resolution.</li>
      </ul>

      <div style="background-color: #3d1f1f; border: 1px solid #8a3a3a; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <strong style="color: #ff6b6b;">⚠️ Important</strong><br>
        Loading a new image is the strongest reset in the application. All adjustments, recipes, tweaks, drama settings, rotation, and My Look selections are cleared. Everything starts fresh from the new image’s analysis. Save any work you want to keep before loading a different image.
      </div>
    `
  },
      // ============================================================
  // CHAPTER 6 - Center Preview — Single View, Split View, Rotate & Settings
  // ============================================================
  {
    id: 6,
    title: "6. Center Preview Controls",
    content: `
      <h2>6. Center Preview — Single View, Split View, Rotate & Settings</h2>

      <h3>6.1 Single View (Default)</h3>
      <p>The center preview displays your graded result in real time. Processing updates near-instantly as you move sliders, switch profiles, or generate new looks. Single view is the default state whenever the Variations Grid is not active.</p>

      <h3>6.2 Split View</h3>
      <p><strong>Toggle button location:</strong> Top-left of the preview area — labeled <strong>Split View / Single View</strong>.</p>
      <p>When Split View is active:</p>
      <ul>
        <li><strong>Left half:</strong> the original, ungraded image</li>
        <li><strong>Right half:</strong> the graded result with all adjustments, tweaks, and Post-Drama applied</li>
      </ul>
      <p>Split View is only available when an image is loaded and the application is not in 9-grid mode. The toggle is disabled during the Variations Grid.</p>

      <h3>6.3 Rotate Image</h3>
      <p><strong>Icon:</strong> Circular arrow — located top-right of the preview area, to the left of the Settings gear icon.</p>
      <p>Rotation is only available in single view and is disabled during 9-grid mode or when Split View is active.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Action</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Result</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Click the rotate icon</td>
            <td style="padding: 12px 16px; color: #ddd;">Enters rotation mode — icon animates; cursor changes to a grab cursor</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left-click the image (in rotation mode)</td>
            <td style="padding: 12px 16px; color: #ddd;">Rotate 90° clockwise — cycles: 0° → 90° → 180° → 270° → 0°</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Right-click (in rotation mode)</td>
            <td style="padding: 12px 16px; color: #ddd;">Exit rotation mode without changing the current angle</td>
          </tr>
        </tbody>
      </table>

      <div style="background-color: #1f2a3d; border: 1px solid #3a5c8a; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <strong style="color: #6bb0ff;">ℹ️ Note</strong><br>
        Rotation applies to both the preview display and the final exported file. Loading a new image resets rotation to 0°.
      </div>

      <h3>6.4 Settings</h3>
      <p><strong>Icon:</strong> Gear — top-right of the preview area. Opens the <strong>Settings overlay</strong>. The header badge updates to <strong>Settings</strong> while the overlay is open.</p>
      <p>The Settings overlay provides a selection of UI color themes. Theme changes are cosmetic only — they do not affect any grade, recipe, or adjustment value.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Theme Name</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Visual Style</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Default (Cinematic Dark)</td>
            <td style="padding: 12px 16px; color: #ddd;">Original dark gold UI — the default application appearance</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Winter (Slate Grey)</td>
            <td style="padding: 12px 16px; color: #ddd;">Cool slate grey palette</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Summer (Warm Glow)</td>
            <td style="padding: 12px 16px; color: #ddd;">Warm amber glow palette</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Autumn (Desert Sand)</td>
            <td style="padding: 12px 16px; color: #ddd;">Sandy, earthy tones</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Spring (Forest Green)</td>
            <td style="padding: 12px 16px; color: #ddd;">Fresh forest green palette</td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top: 20px;">Close the Settings overlay to return to grading. Your theme preference is preserved between sessions.</p>
    `
  },
        // ============================================================
  // CHAPTER 7 - Left Panel — Color Profiles Tab
  // ============================================================
  {
    id: 7,
    title: "7. Left Panel — Color Profiles",
    content: `
      <h2>7. Left Panel — Color Profiles Tab</h2>
      <p>The Color Profiles tab is the heart of the grading workflow. It houses the profile selection system, primary generation controls, Pre-Drama, and the My Looks personal library.</p>

      <h3>7.1 Randomize Look</h3>
      <p>Randomize Look is the primary "give me a new grade" action in Chroma Garden.</p>
      <ul>
        <li>Displayed as an accent button at the top of the Color Profiles tab</li>
        <li><strong>Requires:</strong> a profile selected and an image loaded</li>
        <li>Generates one new randomized recipe for the currently selected profile</li>
        <li>Does not reset Adjustments or Manual Tweaks — existing tweaks carry forward and are applied to the new recipe automatically</li>
      </ul>
      <p>Press Randomize Look repeatedly until you find a starting point you like, then use the Adjustments and Manual Tweaks to refine.</p>

      <h3>7.2 Explore 9 Looks (Variations Grid)</h3>
      <p>Explore 9 Looks generates nine different grades simultaneously, displayed in a 3×3 grid for side-by-side comparison.</p>
      <ul>
        <li>Displayed as an accent button below Randomize Look</li>
        <li><strong>Requires:</strong> a profile selected and an image loaded</li>
        <li>Disabled while a generation pass is in progress</li>
      </ul>

      <p>The button label changes through three states during a generation pass:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Button State</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Explore 9 Looks</td>
            <td style="padding: 12px 16px; color: #ddd;">Ready — no generation in progress</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Generating... N%</td>
            <td style="padding: 12px 16px; color: #ddd;">Building the grid (shows live percentage progress)</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Finalizing...</td>
            <td style="padding: 12px 16px; color: #ddd;">Completing the final processing pass before display</td>
          </tr>
        </tbody>
      </table>

      <p>When the grid is ready, the center preview switches to the 3×3 layout and the header badge updates to <strong>Variations Grid</strong>. Each cell is labeled Grade 1 through Grade 9.</p>

      <h3>How the Grid Selects Its Nine Grades</h3>
      <p>An important detail about how the 9-grid populates its cells: the engine does not simply display each of the nine looks inside a personality exactly once. Instead, it randomizes both which look is drawn for each cell and the mathematical jitter applied to that look’s recipe values independently. This means the same look can appear in the grid more than once — twice, three times, or more — but each instance will carry a different set of jittered values, making each version visually distinct even though they share the same look as their base.</p>

      <p>The same principle applies to single Randomize. Pressing Randomize Look repeatedly can land on the same underlying look more than once across passes, but because the jitter re-randomizes the recipe math every time, the result will not be identical to a previous pass on that same look.</p>

      <p>This is a deliberate design choice. Rather than cycling through looks in a fixed order, the engine treats every generation — whether a single randomize or one cell in a nine-grid — as an independent creative draw. The result is a genuinely exploratory system: the 9-grid is not a catalogue of nine guaranteed-unique looks, it is nine simultaneous creative experiments, each one shaped by both the look it landed on and the unique recipe math generated for that specific instance.</p>

      <h3>Working in the Variations Grid</h3>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Interaction</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Result</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Hover a cell</td>
            <td style="padding: 12px 16px; color: #ddd;">A large preview overlay appears in the center area for close inspection</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Click a cell</td>
            <td style="padding: 12px 16px; color: #ddd;">Selects that grade (cell becomes highlighted)</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Click the lock icon on a cell</td>
            <td style="padding: 12px 16px; color: #ddd;">Locks that grade — locked cells are preserved on the next Explore 9 run; unlocked cells regenerate</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Right panel → Grade 1–9 buttons</td>
            <td style="padding: 12px 16px; color: #ddd;">Alternative way to select a grid cell from the right panel</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Right panel → Promote Selected Grade</td>
            <td style="padding: 12px 16px; color: #ddd;">Applies the selected cell’s grade to the main workspace and exits grid mode</td>
          </tr>
        </tbody>
      </table>

      <div style="background-color: #1f2a3d; border: 1px solid #3a5c8a; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <strong style="color: #6bb0ff;">⭐ Tip — Using Locks</strong><br>
        Lock grades you find compelling, then click Explore 9 Looks again. Only unlocked cells will regenerate. This lets you narrow down progressively toward your ideal look without losing candidates you already like.
      </div>

      <h3>7.3 Pre-Drama (Jitter Intensity)</h3>
      <p><strong>Location:</strong> Color Profiles tab, below the generation buttons</p>
      <p><strong>Range:</strong> 0 to 9 (step 0.1)  <strong>Display:</strong> 1.0× to 10.0× (formula: 1 + slider value)</p>

      <p>Pre-Drama controls how much random variation the engine injects when generating a recipe. Higher values produce more dramatic differences between Randomize presses or between the nine grid cells. Lower values keep results closer together and more predictable.</p>
    <p>Think of Pre-Drama as an engine override rather than a simple preference setting. Under the hood, the engine generates recipe values within a defined mathematical range for each profile. Pre-Drama multiplies the factor applied to those values before they are committed to the recipe — meaning the engine is not just picking from a wider pool of possibilities, it is actively amplifying the magnitude of the numbers it writes. At 1× (Pre-Drama at 0), the engine operates at its baseline range. At 5× or 10×, the same math runs hotter — producing recipes with stronger contrast shifts, more saturated color pushes, more aggressive curve shaping, and more pronounced seasonal characteristics. The result is grades that feel more committed, more cinematic, and more ‘punchy’ compared to the restrained, balanced output at lower settings.</p>

      <p>Because jitter can push recipe values in either direction — positive or negative — the Pre-Drama multiplier amplifies both sides of that range equally. A 2× or 3× multiplier does not just make warm grades warmer; it also makes cool grades colder, dark grades darker, and desaturated grades more muted. Whatever direction the engine’s random draw lands, Pre-Drama scales that magnitude up. This means higher Pre-Drama settings do not bias the grade toward any particular look — they simply make the engine’s choices more extreme in whichever direction they were already heading, producing a wider spread of results across repeated Randomize presses or across the nine cells in Explore 9 Looks.</p>

      <h3>7.4 Seasonal Profiles</h3>
      <p>Profiles are organized into four expandable seasonal sections. Click a <strong>season header</strong> to expand or collapse it; selecting a season also activates it as the current season context. There are 24 seasonal profiles across four seasons — 6 per season.</p>
      <div style="background-color: #1f2a3d; border: 1px solid #3a5c8a; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <strong style="color: #6bb0ff;">ℹ️ Note on Selection Behavior</strong><br><br>
        Selecting a season clears the active recipe data, exits variations mode, and clears any My Look selection highlight. Adjustment sliders and manual tweaks are kept.<br><br>
        Selecting a profile within a season changes the active personality while keeping the current recipe, adjustments, and manual tweaks. A banner appears in the right panel (see §7.1) and My Look selection is cleared.
      </div>

      <h3>Understanding Personalities and Looks</h3>
      <p>In Chroma Garden, the terms <strong>personality</strong> and <strong>profile</strong> are interchangeable — each named profile (Golden Canopy, Cold Daylight, Fresh Bloom, etc.) is an individual personality, and each personality is defined by its own recipe: a distinct set of mathematical parameters that shape the color science of that grade.</p>

      <p>What makes the system more expansive than it first appears is what lives inside each personality. Every personality contains <strong>nine individual looks</strong>, each built on its own unique math — different curve shapes, contrast relationships, color biases, and tonal structures — all crafted to stay true to that personality’s character while offering distinct creative results.</p>

      <p>This means the total number of looks available within a season is larger than the profile count suggests. Take Winter as an example:</p>
      <p><strong>6 personalities × 9 looks each = 54 distinct Winter looks</strong></p>
      <p>The same math applies across every season:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Season</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Personalities</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Looks per Personality</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Total Distinct Looks</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Summer</td>
            <td style="padding: 12px 16px; color: #ddd; text-align: center;">6</td>
            <td style="padding: 12px 16px; color: #ddd; text-align: center;">9</td>
            <td style="padding: 12px 16px; color: #ddd; text-align: center;">54 looks</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Spring</td>
            <td style="padding: 12px 16px; color: #ddd; text-align: center;">6</td>
            <td style="padding: 12px 16px; color: #ddd; text-align: center;">9</td>
            <td style="padding: 12px 16px; color: #ddd; text-align: center;">54 looks</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Autumn</td>
            <td style="padding: 12px 16px; color: #ddd; text-align: center;">6</td>
            <td style="padding: 12px 16px; color: #ddd; text-align: center;">9</td>
            <td style="padding: 12px 16px; color: #ddd; text-align: center;">54 looks</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Winter</td>
            <td style="padding: 12px 16px; color: #ddd; text-align: center;">6</td>
            <td style="padding: 12px 16px; color: #ddd; text-align: center;">9</td>
            <td style="padding: 12px 16px; color: #ddd; text-align: center;">54 looks</td>
          </tr>
        </tbody>
      </table>
      <p>Each time you press Randomize Look or run Explore 9 Looks, the engine draws from these nine looks within the active personality — so even within a single profile like Woodland or Arctic Dusk, you have nine meaningfully different creative directions available before ever touching an adjustment slider.</p>

      <p><strong>Summer — 6 Profiles</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Profile</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Character</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Natural</td>
            <td style="padding: 12px 16px; color: #ddd;">Balanced summer grade adapted to the image’s own characteristics</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Filmic</td>
            <td style="padding: 12px 16px; color: #ddd;">Cinematic summer film look with expressive tonal rendering</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Pastel</td>
            <td style="padding: 12px 16px; color: #ddd;">Soft, muted pastel summer palette</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Sunset</td>
            <td style="padding: 12px 16px; color: #ddd;">Warm sunset gold tones across highlights and midtones</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Deep</td>
            <td style="padding: 12px 16px; color: #ddd;">Richer, deeper summer contrast and color weight</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Cinematic</td>
            <td style="padding: 12px 16px; color: #ddd;">General summer cinematic engine; applies broad creative summer rendering when randomizing</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Spring — 6 Profiles</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Profile</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Character</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Fresh Bloom</td>
            <td style="padding: 12px 16px; color: #ddd;">Bright floral spring with lifted, vibrant color rendering</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Morning Dew</td>
            <td style="padding: 12px 16px; color: #ddd;">Soft, dewy morning light — delicate and luminous</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Spring Field</td>
            <td style="padding: 12px 16px; color: #ddd;">Open pastoral field — airy midtones and natural greens</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Spring Sky</td>
            <td style="padding: 12px 16px; color: #ddd;">Airy sky blues with cool, lifted atmosphere</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Garden Light</td>
            <td style="padding: 12px 16px; color: #ddd;">Gentle, warm garden illumination</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Rainy Day</td>
            <td style="padding: 12px 16px; color: #ddd;">Cool, soft rainy atmosphere with desaturated midtones</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Autumn — 6 Profiles</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Profile</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Character</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Golden Canopy</td>
            <td style="padding: 12px 16px; color: #ddd;">Warm golden foliage — rich amber and ochre tones</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Misty Morning</td>
            <td style="padding: 12px 16px; color: #ddd;">Foggy, soft autumn morning with lifted shadows</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Harvest Field</td>
            <td style="padding: 12px 16px; color: #ddd;">Harvest golds and deep earth tones with warmth and weight</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Woodland</td>
            <td style="padding: 12px 16px; color: #ddd;">Forest depth, shadow separation, and organic green-brown rendering</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Autumn City</td>
            <td style="padding: 12px 16px; color: #ddd;">Urban autumn: neutral-warm, controlled saturation</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Dusk</td>
            <td style="padding: 12px 16px; color: #ddd;">Evening amber, deepened shadows, and cinematic depth</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Winter — 6 Profiles</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Profile</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Character</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Cold Daylight</td>
            <td style="padding: 12px 16px; color: #ddd;">Crisp cold daylight — clean and sharp with a cool cast</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Overcast Snow</td>
            <td style="padding: 12px 16px; color: #ddd;">Soft overcast snow light with lifted, even exposure</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Forest Shade</td>
            <td style="padding: 12px 16px; color: #ddd;">Cool green-blue forest shade with deep shadow rendering</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Winter City</td>
            <td style="padding: 12px 16px; color: #ddd;">Urban winter — steel neutral tones and restrained saturation</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Arctic Dusk</td>
            <td style="padding: 12px 16px; color: #ddd;">Blue arctic dusk with deep shadows and cold highlight shift</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Deep Freeze</td>
            <td style="padding: 12px 16px; color: #ddd;">Deep cinematic cold — maximum blue-steel character</td>
          </tr>
        </tbody>
      </table>

      <h3>How Seasonal Profiles Behave</h3>
      <p>Each profile is a personality with its own color science — cool/warm bias, pastel character, urban feel, forest depth, and so on. When you Randomize or Explore 9, the engine draws from an internal set of recipe variations for that profile and adapts them to your image’s analysis data (brightness, contrast, saturation, skin detection, etc.). The same profile applied to two different images will produce visually different results because the engine is responding to each image individually.</p>
      <h3>7.5 Black & White Profiles</h3>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Profile</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Character</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc; white-space: nowrap;">Strong — Consistent Filmic</td>
            <td style="padding: 12px 16px; color: #ddd;">Consistent filmic black & white with a strong toe, shoulder, and matte character. Results are predictable and cinematic across different images. Curve parameters include toe strength, shoulder strength, and matte level. Strong — Consistent Filmic is the only personality in the entire engine whose nine looks do not jitter. Every other profile — seasonal, portrait, and Curvy — uses mathematical jitter to randomize parameter values within a range each time you press Randomize Look or run Explore 9 Looks. Strong does not. When you randomize this profile, the engine shuffles which of its nine looks is active, but the underlying parameter values for each look remain mathematically fixed. No jitter is applied. This behavior is intentional and directly tied to what this profile is designed to do.</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Curvy</td>
            <td style="padding: 12px 16px; color: #ddd;">Adaptive B&W: exposure, contrast, and brightness respond to the image’s own analysis data. Uses optional filmic curve transforms — toe, shoulder, highlight rolloff, shadow lift, and color separation. More intelligent and image-dependent than Strong; results vary more between images.</td>
          </tr>
        </tbody>
      </table>

      <h3>7.6 Portrait Profile</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Profile</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Human Essence</td>
            <td style="padding: 12px 16px; color: #ddd;">Portrait-focused grading with skin-aware parameters. Draws from an internal library of named creative looks (e.g. Clean Neutral, Cinematic Muted). Selecting this profile switches the application to the portrait season context, enabling skin-protective grading behavior throughout the pipeline.</td>
          </tr>
        </tbody>
      </table>

      <h3>7.7 My Looks — Library</h3>
      <p>The My Looks library stores your saved grades as personal presets that can be applied to any future image.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Control</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Library (header click)</td>
            <td style="padding: 12px 16px; color: #ddd;">Open or close the list of saved looks</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Look row (click)</td>
            <td style="padding: 12px 16px; color: #ddd;">Select the look — it becomes highlighted. Does <strong>not</strong> automatically apply it.</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Apply Look</td>
            <td style="padding: 12px 16px; color: #ddd;">Load the selected saved look into the current workspace</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Rename</td>
            <td style="padding: 12px 16px; color: #ddd;">Open a rename modal for the selected look (max 25 characters)</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Trash</td>
            <td style="padding: 12px 16px; color: #ddd;">Delete the selected look — prompts for confirmation before deleting</td>
          </tr>
        </tbody>
      </table>

      <p>When no looks have been saved yet, the library displays: <em>“No saved looks yet.”</em></p>

      <div style="background-color: #3d1f1f; border: 1px solid #8a3a3a; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <strong style="color: #ff6b6b;">⚠️ Important</strong><br><br>
        Clicking a look row <strong>selects</strong> it — it does not automatically apply it. You must press <strong>Apply Look</strong> to load the saved grade into your workspace. This prevents accidental overwriting of an active grade while browsing the library.
      </div>

      <p>Looks are saved as JSON files in your system’s application data folder (under the <strong>MyLooks</strong> subdirectory).<br>
      Look names are sanitized — invalid filename characters are removed automatically, and names are capped at 25 characters.</p>
      `},
  // ============================================================
  // CHAPTER 8 - Left Panel — Adjustments Tab
  // ============================================================
      {
    id: 8,
    title: "8. Left Panel — Adjustments",
    content: `
      <h2>8. Left Panel — Adjustments Tab</h2>
      <p>The Adjustments tab contains global fine-tuning sliders applied on top of the active recipe. All sliders default to 0 (neutral). Each slider has – and + buttons below it for precise single-step nudges.</p>

      <div style="background-color: #1f2a3d; border: 1px solid #3a5c8a; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <strong style="color: #6bb0ff;">ℹ️ How Adjustments Work</strong><br><br>
        Adjustments sit on top of the recipe layer — they are additional global modifications applied after the recipe is processed. When you Randomize again, the same adjustments remain in place and are applied to the new recipe automatically. This allows you to set a consistent exposure or color correction and explore many recipe variations with it locked in.
      </div>

      <h3>8.1 Basic Exposure</h3>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Slider</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Range</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Step</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Exposure</td>
            <td style="padding: 12px 16px; color: #ddd;">-5 to +5</td>
            <td style="padding: 12px 16px; color: #ddd;">0.1</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Contrast</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.05</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Exposure</strong> — The broadest brightness control in the application. Raises or lowers the overall luminosity of the entire image uniformly — every pixel in every tonal zone moves together. Increasing brightens the image as if more light were hitting the sensor; decreasing darkens it. At high positive values it can push highlights toward clipping; at high negative values it can crush shadow detail.</p>

      <p><strong>Contrast</strong> — Pushes the relationship between light and dark tones further apart or pulls them closer together. Increasing makes darks darker and lights lighter simultaneously — deepening shadows while brightening highlights, giving the image more punch and tonal separation. Decreasing compresses the tonal range inward toward a flatter, lower-contrast, more matte character.</p>

      <h3>8.2 Tone Curve</h3>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Slider</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Range</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Step</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Highlights</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Whites</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Blacks</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Highlights</strong> — Targets the bright regions of the image without significantly affecting midtones or shadows. Pulling it down recovers texture and detail in bright areas not yet clipped — overexposed skies, bright skin, sunlit surfaces. Pushing it up adds luminosity and glow to bright regions.</p>
    <p><strong>Whites</strong> — Controls the very ceiling of the tonal range — the brightest specular highlights and near-white values. Pulling it down clips the white point downward, recovering detail at the very edge of clipping. Pushing it up extends the brightest values toward pure white.</p>

      <p><strong>Blacks</strong> — Controls the floor of the tonal range — the deepest shadows and near-black values. Pulling negative deepens and crushes the darkest tones toward pure black, adding density and richness to shadows. Pushing positive lifts the black point upward, creating a faded, lifted shadow base — the matte-look characteristic of film print or vintage processing.</p>

      <div style="background-color: #1f2a3d; border: 1px solid #3a5c8a; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <strong style="color: #6bb0ff;">ℹ️ Note</strong><br><br>
        A Shadows control exists in the engine but is not exposed in the Adjustments UI in version 0.1.0. If shadows adjustment is needed, use the Manual Tweaks panel in the right panel — if Shadows is part of the current recipe, it may appear as a tweakable parameter there.
      </div>

      <h3>8.3 Color Balance</h3>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Slider</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Range</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Step</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Temperature</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Tint</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Temperature</strong> — Shifts the overall colour cast along the warm-to-cool axis. Positive values warm the image toward orange, amber, and golden tones. Negative values cool it toward blue and cyan. One of the fastest ways to change the emotional feel of a grade.</p>

      <p><strong>Tint</strong> — Shifts the colour cast perpendicular to the temperature axis — from green toward magenta. Positive values push toward magenta and pink; negative values push toward green. Used to correct colour casts from artificial or mixed lighting, or as a creative palette shift.</p>

      <h3>8.4 Color Intensity</h3>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Slider</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Range</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Step</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Vibrance</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Vibrance</strong> — A selective saturation boost that targets colours which are already relatively desaturated and leaves highly saturated colours more or less alone. Enriches muted tones without oversaturating vivid areas or blowing out skin tones. Pulling negative progressively mutes the least saturated colours first.</p>

      <h3>8.5 Presence</h3>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Slider</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Range</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Step</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Clarity</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Texture</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Dehaze</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Clarity</strong> — Adds or removes contrast specifically in the midtone frequency range — the medium-scale detail that defines structure and edges. Increasing makes textures and structural detail pop with more definition. Decreasing softens mid-frequency detail, producing a diffused glowing quality flattering on skin or dreamy portrait grades.</p>
      <p><strong>Texture</strong> — Similar to Clarity but operating at a finer scale — targeting fine surface detail such as skin pores, fabric weave, bark, grain, and hair. Increasing sharpens and brings out micro-detail. Decreasing smooths fine surface texture without disturbing broader contrast structure.</p>
      <p><strong>Dehaze</strong> — Removes or adds atmospheric haze — the milky, low-contrast quality caused by atmospheric scattering or fog. Positive values cut through haze, increasing local contrast and depth. Negative values intentionally add haze for a softer, more atmospheric or vintage quality.</p>
    
      <h3>8.6 Common Curves</h3>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Slider</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Range</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Step</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Parametric Curve</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">RGB Composite</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Red Channel</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Green Channel</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Blue Channel</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Parametric Curve</strong> — A broad tonal S-curve adjustment across the full luminance range. Positive values increase global contrast in a classic S-curve shape, adding punch and depth. Negative values flatten the curve, reducing global contrast and pushing toward a matte character.</p>
      <p><strong>RGB Composite</strong> — A combined brightness adjustment applied equally across all three colour channels simultaneously. Unlike Exposure which is a flat linear lift, RGB Composite applies a curve-shaped brightness adjustment. Positive values lift overall brightness; negative values pull it down.</p>
      <p><strong>Red Channel</strong> — Adjusts the Red channel independently. Pushing positive warms the image, adding orange and amber. Pushing negative removes red, cooling toward cyan. Strong impact on perceived warmth and skin tone rendering.</p>
      <p><strong>Green Channel</strong> — Adjusts the Green channel independently. Positive values push toward olive or teal. Negative values remove green, shifting toward magenta. The most visually neutral of the three channels but still significantly affects the overall palette.</p>
      <p><strong>Blue Channel</strong> — Adjusts the Blue channel independently. Positive values cool highlights toward cyan and push shadows toward blue. Negative values warm shadows toward brown and amber. Outsized influence on perceived mood and atmosphere.</p>

      <h3>8.7 Creative Curves</h3>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Slider</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Range</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Step</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Filmic Toe</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Filmic Shoulder</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Highlight Rolloff</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Shadow Lift</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Color Separation</td>
            <td style="padding: 12px 16px; color: #ddd;">-1 to +1</td>
            <td style="padding: 12px 16px; color: #ddd;">0.01</td>
          </tr>
        </tbody>
      </table>
    
      <p><strong>Filmic Toe</strong> — Controls the shape of the shadow end of the tonal curve — where dark values curve and compress rather than dropping linearly to pure black. Increasing deepens and rounds this shadow transition, giving dark areas weight and density with a gradual rolloff into black. Decreasing flattens or lifts the toe, making shadows lighter and more open.</p>
      <p><strong>Filmic Shoulder</strong> — Controls the shape of the highlight end of the tonal curve — where bright values curve and compress rather than clipping linearly to pure white. Increasing softens and compresses the highlight rolloff, producing that organic, luminous quality where bright areas feel full rather than clipped. Decreasing makes the shoulder more linear — highlights have more crispness before they compress.</p>
      <p><strong>Highlight Rolloff</strong> — Controls how quickly bright values transition into the shoulder of the curve. High values produce a gradual transition where highlights bloom and soften early. Low values make the transition more abrupt. Works closely with Filmic Shoulder: Shoulder sets the shape; Rolloff controls the speed at which values enter that shape.</p>
      <p><strong>Shadow Lift</strong> — Raises or lowers the baseline floor from which the darkest tones begin. Lifting the floor creates a faded matte look where blacks never reach full density — the lifted shadow baseline of film print and vintage grading. Pushing negative deepens the floor, making the darkest values more absolute and dense.</p>
      <p><strong>Color Separation</strong> — Controls how distinctly different colour hues are pushed apart from each other. Increasing makes individual colour regions more visually distinct and vibrant relative to each other. Decreasing pushes colours closer together toward a more unified, compressed, or near-monochromatic character. Particularly impactful on images with wide, competing colour palettes.</p>

      <h3>8.8 Reset All</h3>
      <p>The <strong>Reset All</strong> button is located at the bottom of the Adjustments tab. Pressing it zeros all adjustment sliders back to 0 in a single action.</p>

      <div style="background-color: #1f2a3d; border: 1px solid #3a5c8a; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <strong style="color: #6bb0ff;">ℹ️ Note</strong><br><br>
        Reset All affects <strong>only</strong> the Adjustments tab sliders. It does not reset Manual Tweaks, Post-Drama, Pre-Drama, or the active recipe. Use Reset Tweaks (right panel) to clear Manual Tweaks separately.
      </div>
     `
  },

          // ============================================================
  // CHAPTER 9 - Right Panel — Data & Tweaks Tab
  // ============================================================
  {
    id: 9,
    title: "9. Right Panel — Data & Tweaks",
    content: `
      <h2>9. Right Panel — Data & Tweaks Tab</h2>

      <h3>9.1 Profile-Changed Banner</h3>
      <p>When you switch to a different profile after a recipe already exists, the following informational banner appears at the top of the Data & Tweaks tab:</p>

      <div style="background-color: #3d2a1f; border: 1px solid #8a5c2a; border-radius: 6px; padding: 16px; margin: 20px 0;">
        <strong style="color: #ff9f4d;">Profile Changed</strong><br>
        "Profile changed. Generate a new look to update the recipe."
      </div>

      <p>This is informational only. Your adjustments and tweaks are preserved. The engine recommends running Randomize Look or Explore 9 Looks to generate a fresh recipe suited to the new profile’s personality. Save and Export remain available at any time regardless of this banner.</p>

      <h3>9.2 Original Image Analysis (Collapsible)</h3>
      <p>A read-only technical readout generated automatically when the image first loads. Click the section header to expand or collapse it. The data is organized as follows:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Category</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Fields</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Luminance</td>
            <td style="padding: 12px 16px; color: #ddd;">Average, minimum, maximum, contrast</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Tone Distribution</td>
            <td style="padding: 12px 16px; color: #ddd;">Shadow %, midtone %, highlight %</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Color</td>
            <td style="padding: 12px 16px; color: #ddd;">Color axes, color cast label (e.g. warm, cool, neutral)</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Saturation</td>
            <td style="padding: 12px 16px; color: #ddd;">Average, maximum, low-saturation %, high-saturation %</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Edges & Skin</td>
            <td style="padding: 12px 16px; color: #ddd;">Edge density, skin pixel %, whether skin was detected (boolean)</td>
          </tr>
        </tbody>
      </table>

      <p>Original Image Analysis is a basic image detection pass — a lightweight scan compiled automatically the moment each image enters the center canvas. It does not alter the image in any way. Think of it as the app reading the unique DNA already present in the photo: what tones are dominant, how light or dark the image is, what colour cast exists, how saturated the content is, and whether skin tones are present. This scan runs once per image load and is not repeated unless a new image is loaded.</p>
      <p>That image DNA is what the engine uses to influence jitter randomizations across most profile personalities. Rather than generating recipes in a vacuum, the engine reads this analysis and uses it to steer the random values it produces — keeping tonal adjustments within a subtle, non-destructive threshold that respects where the image already sits tonally. This is why the same profile can produce a noticeably different result on two different images: the analysis is unique to each photo, and the recipe is shaped around it.</p>
      <p>One field worth noting specifically is hasSkin — the boolean (true/false) indicator of whether skin tones were detected in the image. This detection is intentionally basic: it works by identifying tonal ranges that correspond to common skin tones rather than using any form of object or face recognition. As a result, it can generate a false positive (reporting skin detected when none is present) or a false negative (missing skin that is present) depending on the image's colour palette, lighting, and content. Images with warm earth tones, sunlit foliage, or desaturated subjects are most likely to trigger edge cases. This does not cause the app to fail — it simply means the skin-aware parameter adjustments in portrait and seasonal profiles may be slightly more or less active than expected on that particular image.</p>


      <h3>9.3 Active Recipe Raw Data (Collapsible)</h3>
      <p>A flat list of all numeric and text fields in the current active recipe — exactly what the engine generated. Click the section header to expand or collapse it.</p>

      <p>Think of Active Recipe Raw Data as a window cut directly into the engine itself. Imagine taking a large square tile out of the hood of a car, starting the engine, and leaning over to watch all the moving parts turning, firing, and reacting in real time — that is what this panel is. It does not summarize or interpret what the engine is doing. It shows you exactly what is happening inside, in the engine's own language, at the moment it happens.</p>
      <p>This panel was originally designed as a debug state — a developer-facing readout built to verify that the engine was producing the correct values during testing. It was kept in the shipping version of the application intentionally, even in its raw, non-human-friendly form. The deliberate choice to leave it unpolished was made because the readout serves as direct, visible evidence of function. Every field, every value, every key you see in that list is the engine doing exactly what it was built to do. My vision isn't necessarily your vision — and this panel makes that visible.</p>
      <p>Manual Tweaks, the collapsible section directly below, came later. They were built as a humanized layer on top of this raw data — the same fields, the same engine parameters, but surfaced with readable labels and intuitive controls rather than raw key-value pairs. Every Manual Tweaks slider or toggle is a direct override switch into the Active Recipe Raw Data. When you move a Manual Tweaks control, you are reaching into the engine readout and changing one of those fields by hand, placing that specific dimension of the grade back under your direct creative control.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">State</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Display</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Before first Randomize or Explore 9</td>
            <td style="padding: 12px 16px; color: #ddd;">"Click Randomize or Generate Variations to produce recipe data."</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">No profile selected</td>
            <td style="padding: 12px 16px; color: #ddd;">"Select a profile to begin."</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Recipe generated</td>
            <td style="padding: 12px 16px; color: #ddd;">Flat list of all recipe fields and values</td>
          </tr>
        </tbody>
      </table>

      <p>Recipe field names vary by profile type:</p>
      <ul>
        <li><strong>Seasonal / Portrait profiles:</strong> many <code>params.*</code> keys — exposure, contrast, temperature, skin protect, and season-specific effects (e.g. fog density, warmth parameters)</li>
        <li><strong>B&amp;W Strong:</strong> params with filmic curve strengths (toe, shoulder, matte, contrast)</li>
        <li><strong>B&amp;W Curvy:</strong> base values (exposure, contrast, brightness), curve amounts, personality ID, label, and pass</li>
      </ul>

     <h3>9.4 Post-Drama Intensity</h3>
      <p><strong>Range:</strong> -5 to +5  <strong>Step:</strong> 0.5</p>

      <p>Post-Drama scales the recipe parameters to increase or decrease the overall intensity of the active grade:</p>

      <ul>
        <li><strong>Positive values (+1 to +5):</strong> stronger contrast and saturation — more dramatic, cinematic result</li>
        <li><strong>0:</strong> neutral — grade plays exactly as generated</li>
        <li><strong>Negative values (-1 to -5):</strong> softer, more restrained, understated grade</li>
      </ul>

      <p>Post-Drama operates in two places simultaneously:</p>
      <ol>
        <li><strong>Preview:</strong> a real-time display filter (CSS contrast + saturation) is applied to the preview image so you see the effect immediately as you move the slider</li>
        <li><strong>Export:</strong> the same Post-Drama calculation is applied to the full-resolution processing pipeline at export time</li>
      </ol>

      <p>Post-Drama operates at the pixel level — it is applied after the image has already been generated by the engine. Once the recipe has been built and the grade has been rendered, Post-Drama steps in and modifies the result directly on the output pixels, scaling contrast and saturation values on top of the finished image.</p>

      <p>This makes Post-Drama the polar opposite — but sister mechanic — to Pre-Drama. The two controls work at opposite ends of the pipeline and at entirely different levels. Pre-Drama is an engine-level control: it acts before image generation, shaping how aggressively the engine writes its recipe values in the first place. Post-Drama is a pixel-level control: it acts after image generation, pushing or pulling the finished result. Pre-Drama changes what the engine produces. Post-Drama changes what you see from what the engine already produced. Used together, they give you control over both the raw creative DNA of the grade and its final visual intensity.</p>

      <div style="background-color: #1f2a3d; border: 1px solid #3a5c8a; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <strong style="color: #6bb0ff;">⭐ Tip</strong><br><br>
        Post-Drama is saved with My Looks and restored when you apply a saved look. This means your intended intensity level is always preserved as part of the grade.
      </div>
      <h3>9.5 Select Grade (Variations Grid Mode Only)</h3>
      <p>When Explore 9 Looks is active, the right panel's Data & Tweaks tab shows a 3×3 set of Grade 1–9 buttons and a Promote Selected Grade button. This area is only visible and active during grid mode.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Control</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Grade 1 – Grade 9 buttons</td>
            <td style="padding: 12px 16px; color: #ddd;">Select the corresponding cell in the Variations Grid (highlights that cell)</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Promote Selected Grade</td>
            <td style="padding: 12px 16px; color: #ddd;">Applies the selected cell’s grade to the main workspace and exits grid mode, returning to single-view Color Grading Engine mode with the chosen look loaded and ready to refine</td>
          </tr>
        </tbody>
      </table>

      <h3>9.6 Manual Tweaks (Collapsible)</h3>
      <p>Manual Tweaks provide fine-grained control over the recipe’s own internal parameters — separate from the left-panel Adjustments, which are global modifiers.</p>

      <ul>
        <li>Sliders appear <strong>automatically</strong> based on the active recipe — the controls displayed depend on which profile is active and what the engine generated</li>
        <li>Range per tweak: -1.5 to +1.5</li>
        <li>Step: 0.3 (plus and minus buttons are available for precise nudging)</li>
        <li><strong>Reset Tweaks</strong> button: clears all manual tweak offsets back to 0</li>
      </ul>

      <p>Manual Tweaks are <strong>additive deltas</strong> — they add to the current recipe values rather than replacing them. The combined result is then processed through the full image pipeline.</p>

      <p>The tweakable parameters exposed depend on the active profile:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Profile Type</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Tweakable Parameters</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Seasonal / Portrait</td>
            <td style="padding: 12px 16px; color: #ddd;">All numeric <code>params.*</code> fields in the recipe (excluding internal labels such as personality ID, pass index, and text identifiers)</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">B&amp;W Strong</td>
            <td style="padding: 12px 16px; color: #ddd;">Base exposure, base contrast, base brightness</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">B&amp;W Curvy</td>
            <td style="padding: 12px 16px; color: #ddd;">Base brightness only; plus four curve amount sliders labeled: <strong>Highlight Detail</strong>, <strong>Highlight Range</strong>, <strong>Global Tone</strong>, <strong>Highlight Focus</strong></td>
          </tr>
        </tbody>
      </table>
  `
  },
          // ============================================================
  // CHAPTER 10 - Right Panel — Exports Tab
  // ============================================================
{
    id: 10,
    title: "10. Right Panel — Exports",
    content: `
      <h2>10. Right Panel — Exports Tab</h2>

      <h3>10.1 Save / Export</h3>
      <p>Exports the fully graded image as a file to your local storage.</p>

      <ul>
        <li>Opens a <strong>native Save dialog</strong> — choose your destination folder and file format (PNG or JPEG)</li>
        <li><strong>Output resolution:</strong> full original image resolution (not the scaled preview size)</li>
        <li>The exported file exactly matches what you see: recipe + adjustments + manual tweaks + Post-Drama + rotation — all applied at full quality</li>
      </ul>

      <div style="background-color: #1f2a3d; border: 1px solid #3a5c8a; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <strong style="color: #6bb0ff;">⭐ Tip</strong><br><br>
        Use PNG for lossless output (recommended for editing masters). Use JPEG for sharing and delivery where file size matters. Both formats are processed at full original resolution.
      </div>

      <h3>10.2 Save Look</h3>
      <p>Saves the current grade as a named preset in your My Looks library.</p>

      <ul>
        <li>Opens a <strong>Save Look modal</strong> — enter a unique name for the look (max 25 characters)</li>
        <li>Duplicate names are rejected — each look in the library must have a unique name</li>
      </ul>

      <p>The following state is captured in every saved look:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Saved Element</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Season, Profile &amp; Mode</td>
            <td style="padding: 12px 16px; color: #ddd;">Seasonal / Portrait / Black &amp; White context</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Recipe snapshot</td>
            <td style="padding: 12px 16px; color: #ddd;">Full set of recipe parameters at save time</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Adjustment slider values</td>
            <td style="padding: 12px 16px; color: #ddd;">All 17 left-panel adjustment sliders</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Manual tweak values</td>
            <td style="padding: 12px 16px; color: #ddd;">All active Manual Tweak deltas from the right panel</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Post-Drama &amp; Pre-Drama settings</td>
            <td style="padding: 12px 16px; color: #ddd;">Both drama values at save time</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Thumbnail preview</td>
            <td style="padding: 12px 16px; color: #ddd;">A small preview thumbnail of the graded image</td>
          </tr>
        </tbody>
      </table>
    `
  },
          // ============================================================
  // CHAPTER 11 - My Looks — Complete Workflow
  // ============================================================
{
    id: 11,
    title: "11. My Looks",
    content: `
      <h2>11. My Looks — Complete Workflow</h2>

      <h3>11.1 Saving a Look</h3>
      <ol>
        <li>Grade an image to your satisfaction — select a profile, Randomize, apply any Adjustments and Manual Tweaks</li>
        <li>Go to the right panel → Exports tab → click <strong>Save Look</strong></li>
        <li>Enter a unique name in the Save Look modal (max 25 characters) → click <strong>Save</strong></li>
      </ol>

      <h3>11.2 Applying a Saved Look</h3>
      <ol>
        <li>Load an image (the same photo or a new one)</li>
        <li>Left panel → <strong>Library</strong> header → click the look row to select it (it highlights)</li>
        <li>Click <strong>Apply Look</strong></li>
        <li>The app restores: season/profile, recipe, adjustments, tweaks, Post-Drama, and Pre-Drama — and re-runs the engine as needed for the saved mode</li>
      </ol>

      <h3>11.3 Renaming or Deleting</h3>
      <ul>
        <li><strong>Rename:</strong> select a look in the library → click <strong>Rename</strong> → enter new name in the modal (max 25 characters) → confirm</li>
        <li><strong>Delete:</strong> select a look → click the <strong>Trash</strong> icon → confirm in the confirmation dialog</li>
      </ul>

      <h3>11.4 Important Behavior Notes</h3>

      <div style="background-color: #1f2a3d; border: 1px solid #3a5c8a; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <strong style="color: #6bb0ff;">ℹ️ Note</strong><br><br>
        Apply Look restores the full saved state — recipe, adjustments, tweaks, and both drama values.<br><br>
        Switching profile after applying a look keeps sliders and tweaks but changes personality. Use Randomize Look for a new recipe matched to the new profile.<br><br>
        Switching season performs a stronger reset — clears the recipe and variations data. For a completely clean slate after a season change, use Reset All + Reset Tweaks + Randomize.<br><br>
        Loading a new image clears all grading state entirely, including My Look selection. The library itself (the saved files) is unaffected.
      </div>

      <h3>11.5 Data Storage Location</h3>
      <p>Your saved My Looks are stored locally on your computer at the following location:</p>
      <p><code>%APPDATA%\\Chroma Garden\\MyLooks\\</code></p>
      <p>To back up your saved looks, simply copy this entire folder to another location. Deleting files inside this folder will permanently remove them from your library.</p>
    `
  },
            // ============================================================
  // CHAPTER 12 - How Grading Layers Stack
  // ============================================================
{
    id: 12,
    title: "12. How Grading Layers Stack",
    content: `
      <h2>12. How Grading Layers Stack</h2>
      <p>Understanding the four-layer processing stack is the key to getting consistent and predictable results from Chroma Garden. Each layer builds on the one below it.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Layer</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Where to Find It</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">What It Does</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">1. Recipe</td>
            <td style="padding: 12px 16px; color: #ddd;">Generated by Randomize Look / Explore 9 Looks / Apply Look</td>
            <td style="padding: 12px 16px; color: #ddd;">The profile personality — the creative foundation. Defines the overall look, season character, tone rendering, and color science.</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">2. Adjustments</td>
            <td style="padding: 12px 16px; color: #ddd;">Left panel — Adjustments tab</td>
            <td style="padding: 12px 16px; color: #ddd;">Global Lightroom-style tuning applied on top of the recipe. Affects all images equally regardless of which recipe is active.</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">3. Manual Tweaks</td>
            <td style="padding: 12px 16px; color: #ddd;">Right panel — Data &amp; Tweaks tab</td>
            <td style="padding: 12px 16px; color: #ddd;">Additive deltas applied directly to individual recipe parameters. Fine-tunes specific aspects of the current recipe without replacing it.</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">4. Post-Drama</td>
            <td style="padding: 12px 16px; color: #ddd;">Right panel — Data &amp; Tweaks tab</td>
            <td style="padding: 12px 16px; color: #ddd;">Global intensity multiplier: scales recipe parameter strength and applies a real-time contrast/saturation boost or reduction to both preview and export.</td>
          </tr>
        </tbody>
      </table>

      <div style="background-color: #1f2a3d; border: 1px solid #3a5c8a; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <strong style="color: #6bb0ff;">ℹ️ Where Pre-Drama Fits</strong><br><br>
        Pre-Drama is not part of the rendering stack. It controls how random the <em>next generated recipe</em> will be — it influences the Recipe layer at generation time but has no effect on the current static rendering.<br><br>
        Think of Pre-Drama as controlling how adventurous the engine is when you press Randomize or Explore 9.
      </div>
    `
  },
          // ============================================================
  // CHAPTER 13 - Typical User Workflows
  // ============================================================
  {
    id: 13,
    title: "13. Typical User Workflows",
    content: `
      <h2>13. Typical User Workflows</h2>

      <h3>13.1 Workflow A — Quick Grade</h3>
      <p>The fastest path from image to finished export.</p>
      <ol>
        <li>Load an image (click preview or drag and drop)</li>
        <li>Expand a season → select a profile</li>
        <li>Click <strong>Randomize Look</strong> until you find a starting point you like</li>
        <li>Optionally adjust Exposure / Contrast in the Adjustments tab, or fine-tune in Manual Tweaks</li>
        <li>Right panel → Exports tab → <strong>Save / Export</strong> to write the file</li>
      </ol>

      <h3>13.2 Workflow B — Compare Nine Options</h3>
      <p>Best when you want to explore the full range of what a profile can produce.</p>
      <ol>
        <li>Load an image → select a profile</li>
        <li>Click <strong>Explore 9 Looks</strong> — wait for the grid to generate</li>
        <li>Hover cells to inspect them in the large overlay preview</li>
        <li>Lock any favorites with the lock icon on each cell</li>
        <li>Click <strong>Explore 9 Looks</strong> again — locked cells remain; unlocked cells regenerate with new recipes</li>
        <li>Repeat until you have a clear winner</li>
        <li>Right panel → click the matching <strong>Grade</strong> button → <strong>Promote Selected Grade</strong> to bring it to the main workspace</li>
        <li>Fine-tune with Adjustments or Manual Tweaks → <strong>Save / Export</strong></li>
      </ol>

      <h3>13.3 Workflow C — Build a Signature Look Library</h3>
      <p>For professionals who want a consistent personal style across multiple shoots.</p>
      <ol>
        <li>Develop a grade you love on a reference image</li>
        <li>Right panel → Exports → <strong>Save Look</strong> → enter a memorable name → <strong>Save</strong></li>
        <li>On new photos: load image → left panel → Library → select the look → <strong>Apply Look</strong></li>
        <li>Make small per-image tweaks using Adjustments if needed</li>
        <li>Export — or save as a new look variant</li>
        <li>Rename or delete outdated looks in the library as your visual style evolves</li>
      </ol>

      <h3>13.4 Workflow D — Before/After Check</h3>
      <p>Use at any point during grading to evaluate your progress against the original.</p>
      <ol>
        <li>Grade the image in single view to your satisfaction</li>
        <li>Click the <strong>Split View</strong> toggle (top-left of preview) to compare original (left) versus graded (right)</li>
        <li>Make any final adjustments while comparing</li>
        <li>Return to single view → <strong>Save / Export</strong></li>
      </ol>
    `
  },
          // ============================================================
  // CHAPTER 14 - Complete Controls Reference
  // ============================================================
  {
    id: 14,
    title: "14. Complete Controls Reference",
    content: `
      <h2>14. Complete Controls Reference</h2>
      <p>A consolidated reference of every interactive control in Chroma Garden, organized by panel location.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Location</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Control</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left / Color Profiles</td>
            <td style="padding: 12px 16px; color: #ddd;">Randomize Look</td>
            <td style="padding: 12px 16px; color: #ddd;">Generate one new recipe for the active profile</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left / Color Profiles</td>
            <td style="padding: 12px 16px; color: #ddd;">Explore 9 Looks</td>
            <td style="padding: 12px 16px; color: #ddd;">Open the 3×3 Variations Grid and generate nine grades simultaneously</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left / Color Profiles</td>
            <td style="padding: 12px 16px; color: #ddd;">Pre-Drama slider</td>
            <td style="padding: 12px 16px; color: #ddd;">Set random jitter intensity for recipe generation (1× – 10×)</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left / Color Profiles</td>
            <td style="padding: 12px 16px; color: #ddd;">Season headers</td>
            <td style="padding: 12px 16px; color: #ddd;">Expand the section and activate that season as the current context</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left / Color Profiles</td>
            <td style="padding: 12px 16px; color: #ddd;">Profile buttons</td>
            <td style="padding: 12px 16px; color: #ddd;">Select a profile personality within the active season</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left / Color Profiles</td>
            <td style="padding: 12px 16px; color: #ddd;">Library (header click)</td>
            <td style="padding: 12px 16px; color: #ddd;">Open or close the My Looks list</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left / Color Profiles</td>
            <td style="padding: 12px 16px; color: #ddd;">Look row (click)</td>
            <td style="padding: 12px 16px; color: #ddd;">Select a saved look in the library (does not apply it)</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left / Color Profiles</td>
            <td style="padding: 12px 16px; color: #ddd;">Apply Look</td>
            <td style="padding: 12px 16px; color: #ddd;">Apply the selected saved look to the current workspace</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left / Color Profiles</td>
            <td style="padding: 12px 16px; color: #ddd;">Rename</td>
            <td style="padding: 12px 16px; color: #ddd;">Rename the selected saved look (max 25 characters)</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left / Color Profiles</td>
            <td style="padding: 12px 16px; color: #ddd;">Trash</td>
            <td style="padding: 12px 16px; color: #ddd;">Delete the selected saved look (confirmation required)</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left / Adjustments</td>
            <td style="padding: 12px 16px; color: #ddd;">Section headers</td>
            <td style="padding: 12px 16px; color: #ddd;">Expand or collapse slider groups within the Adjustments tab</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left / Adjustments</td>
            <td style="padding: 12px 16px; color: #ddd;">Adjustment sliders (17)</td>
            <td style="padding: 12px 16px; color: #ddd;">Fine-tune the grade globally on top of the active recipe</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Left / Adjustments</td>
            <td style="padding: 12px 16px; color: #ddd;">Reset All</td>
            <td style="padding: 12px 16px; color: #ddd;">Zero all 17 adjustment sliders back to 0</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Center</td>
            <td style="padding: 12px 16px; color: #ddd;">Click / Drop (empty state)</td>
            <td style="padding: 12px 16px; color: #ddd;">Load an image via file picker or drag-and-drop</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Center</td>
            <td style="padding: 12px 16px; color: #ddd;">Split View toggle</td>
            <td style="padding: 12px 16px; color: #ddd;">Toggle the before/after split comparison view</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Center</td>
            <td style="padding: 12px 16px; color: #ddd;">Rotate icon</td>
            <td style="padding: 12px 16px; color: #ddd;">Enter rotation mode — left-click image to rotate 90° CW; right-click to exit</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Center</td>
            <td style="padding: 12px 16px; color: #ddd;">Settings gear</td>
            <td style="padding: 12px 16px; color: #ddd;">Open the Settings overlay to change UI themes</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Center (grid mode)</td>
            <td style="padding: 12px 16px; color: #ddd;">Grade cell (click)</td>
            <td style="padding: 12px 16px; color: #ddd;">Select a variation cell in the Variations Grid</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Center (grid mode)</td>
            <td style="padding: 12px 16px; color: #ddd;">Grade cell (hover)</td>
            <td style="padding: 12px 16px; color: #ddd;">Display a large preview overlay of that cell’s grade</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Center (grid mode)</td>
            <td style="padding: 12px 16px; color: #ddd;">Lock icon (per cell)</td>
            <td style="padding: 12px 16px; color: #ddd;">Lock or unlock a cell to protect it from regeneration on the next Explore 9 run</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Right / Data &amp; Tweaks</td>
            <td style="padding: 12px 16px; color: #ddd;">Post-Drama slider</td>
            <td style="padding: 12px 16px; color: #ddd;">Scale overall recipe intensity and apply a real-time contrast/saturation effect</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Right / Data &amp; Tweaks</td>
            <td style="padding: 12px 16px; color: #ddd;">Manual Tweak sliders</td>
            <td style="padding: 12px 16px; color: #ddd;">Add fine-grained deltas to individual recipe parameters</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Right / Data &amp; Tweaks</td>
            <td style="padding: 12px 16px; color: #ddd;">Reset Tweaks</td>
            <td style="padding: 12px 16px; color: #ddd;">Clear all manual tweak offsets back to 0</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Right / Data &amp; Tweaks</td>
            <td style="padding: 12px 16px; color: #ddd;">Grade 1–9 buttons</td>
            <td style="padding: 12px 16px; color: #ddd;">Select a grid cell from the right panel (grid mode only)</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Right / Data &amp; Tweaks</td>
            <td style="padding: 12px 16px; color: #ddd;">Promote Selected Grade</td>
            <td style="padding: 12px 16px; color: #ddd;">Apply the chosen grid cell’s grade to the main workspace and exit grid mode</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Right / Exports</td>
            <td style="padding: 12px 16px; color: #ddd;">Save / Export</td>
            <td style="padding: 12px 16px; color: #ddd;">Write the fully graded image to a file (PNG or JPEG) at full original resolution</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Right / Exports</td>
            <td style="padding: 12px 16px; color: #ddd;">Save Look</td>
            <td style="padding: 12px 16px; color: #ddd;">Save the current complete grade state to the My Looks library</td>
          </tr>
        </tbody>
      </table>
    `
  },
          // ============================================================
  // CHAPTER 15 - What Resets What
  // ============================================================
  {
    id: 15,
    title: "15. What Resets What",
    content: `
      <h2>15. What Resets What</h2>
      <p>A quick reference for understanding exactly how each action affects your working state. Use this to avoid unintentional loss of work.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Action</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Recipe</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Adjustments</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Manual Tweaks</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Post / Pre-Drama</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">Rotation</th>
            <th style="padding: 12px 16px; text-align: left; border-bottom: 2px solid #1e5c8a; color: #e0f0ff;">My Look Selection</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Load new image</td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>Cleared</strong></td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>Cleared</strong></td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>Cleared</strong></td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>Cleared</strong></td>
            <td style="padding: 12px 16px; color: #ddd;">Reset to 0°</td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>Cleared</strong></td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Change season</td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>Cleared</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept *</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept *</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept *</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>Cleared</strong></td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Change profile</td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept (pinned)</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>Cleared</strong></td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Randomize / Explore 9</td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>New recipe</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #ddd;">—</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Reset All (adjustments)</td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>Zeroed</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #ddd;">—</td>
          </tr>
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 12px 16px; color: #ccc;">Reset Tweaks</td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>Zeroed</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #ddd;">—</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #ccc;">Apply Look</td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>Replaced</strong></td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>Replaced</strong></td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>Replaced</strong></td>
            <td style="padding: 12px 16px; color: #ff6b6b;"><strong>Replaced</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Kept</strong></td>
            <td style="padding: 12px 16px; color: #6bb0ff;"><strong>Selected</strong></td>
          </tr>
        </tbody>
      </table>

      <p><em>* Changing season clears the recipe debug data but does not trigger the same full reset as loading a new image. Sliders, tweaks, and drama values are retained. For a completely clean slate after a season change, use Reset All + Reset Tweaks + Randomize.</em></p>
    `
  },

          // ============================================================
  // CHAPTER 16 - Troubleshooting
  // ============================================================  
{
    id: 16,
    title: "16. Troubleshooting",
    content: `
      <h2>16. Troubleshooting</h2>

      <h3>16.1 The preview isn't updating after I move a slider</h3>
      <p>Ensure that both of the following conditions are met: an image is loaded, and a profile is selected. The preview only processes when both are true. If the preview still does not update after confirming these conditions, try clicking <strong>Randomize Look</strong> to generate a fresh recipe — this forces the engine to produce a new starting state.</p>

      <h3>16.2 Explore 9 Looks is grayed out / not clickable</h3>
      <p>This button is disabled while a generation pass is in progress. Wait for the progress indicator to complete — it will cycle through <em>Generating... N%</em> to <em>Finalizing...</em> before returning to the ready state labeled <strong>Explore 9 Looks</strong>.</p>

      <h3>16.3 My Save Look button says the name is a duplicate</h3>
      <p>Look names must be unique within the library. Open the My Looks library and check for an existing look with the same name. Either rename or delete the existing look, or choose a different name for the new one. Names are capped at 25 characters.</p>

      <h3>16.4 The exported file looks different from the preview</h3>
      <ul>
        <li>Check that you have not changed the <strong>Post-Drama</strong> slider between previewing and exporting — the export uses the current slider value at the time of export</li>
        <li>The preview is scaled for performance (approximately 1,600 px maximum on the longest side); the export is full original resolution, which can reveal fine detail and tonal information not visible at preview scale</li>
      </ul>

      <h3>16.5 My grade looks very similar every time I Randomize</h3>
      <p>Increase the <strong>Pre-Drama</strong> slider (left panel, Color Profiles tab). A higher multiplier value — closer to 10× — increases the random variation strength between generation passes. At low Pre-Drama values, results cluster closely together by design.</p>

      <h3>16.6 I applied a saved look but the image looks different from when I saved it</h3>
      <p>Looks capture the complete grade state — recipe, sliders, tweaks, and drama settings — but they do not capture the image itself. Different images will naturally produce different visual results from the same grade because the engine adapts to each image’s analysis data (luminance, tone distribution, color cast, skin content). This is expected and intentional behavior.</p>

      <h3>16.7 The Split View or Rotate icon is disabled</h3>
      <p>Both controls are unavailable while in 9-grid mode. Exit the Variations Grid first — either by promoting a grade or by switching profiles — then return to single view. Both controls will become available again.</p>

      <h3>16.8 I can’t find the Shadows slider</h3>
      <p>A Shadows control exists in the processing engine but is not exposed in the Adjustments tab UI in version 0.1.0. If shadows control is needed, use the <strong>Manual Tweaks</strong> panel in the right panel. If Shadows is part of the current recipe, it will appear there as a tweakable parameter. Alternatively, use the <strong>Blacks</strong> slider in the Tone Curve section of Adjustments for global shadow adjustment.</p>
    `
  },
          // ============================================================
  // CHAPTER 17 - Known Limitations
  // ============================================================
  {
    id: 17,
    title: "17. Known Limitations (v0.1.0)",
    content: `
      <h2>17. Known Limitations (v0.1.0)</h2>
      <p>Batch processing of multiple images is not currently supported. RAW image formats (.CR2, .NEF, .ARW, .DNG, etc.) are not supported. The application is designed for single-image color grading and creative exploration. Advanced professional features such as layers, masks, and retouching tools are not included in this version.</p>
    `
  },
          // ============================================================
  // CHAPTER 18 - Contact & Support
  // ============================================================
{
    id: 18,
    title: "18. Contact & Support",
    content: `
      <h2>18. Contact & Support</h2>
      <p>For bug reports, feature requests, or general questions, please visit our Etsy shop:</p>
      
      <a 
        href="https://www.etsy.com/shop/digitalsynthesis" 
        target="_blank" 
        rel="noopener noreferrer"
        style="color: #4da6ff; text-decoration: underline; font-size: 1.05em;">
        Open My Etsy Shop
      </a>
      
      <p style="margin-top: 12px; opacity: 0.7; font-size: 0.95em;">
        https://www.etsy.com/shop/digitalsynthesis
      </p>
    `
  },
          // ============================================================
  // CHAPTER 19 - Glossary
  // ============================================================
{
    id: 19,
    title: "19. Glossary",
    content: `
      <h2>19. Glossary</h2>
      <p>All terms are listed alphabetically. Terms that appear as controls in the application are shown in <strong>bold</strong>.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1a1a1a; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #0d2b3d;">
            <th style="padding: 12px 16px; text-align: left; border: 1px solid #333; font-weight: 600;">Term</th>
            <th style="padding: 12px 16px; text-align: left; border: 1px solid #333; font-weight: 600;">Definition</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;"><strong>Adjustments</strong></td><td style="padding: 10px 16px; border: 1px solid #333;">Global left-panel sliders (Exposure, Contrast, Tone Curve, Color Balance, etc.) applied on top of the active recipe. All default to 0 (neutral).</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;"><strong>Apply Look</strong></td><td style="padding: 10px 16px; border: 1px solid #333;">The control that loads a selected My Look from the library into the current workspace, restoring all saved state.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Color Cast</td><td style="padding: 10px 16px; border: 1px solid #333;">A dominant hue shift detected in the image during analysis — e.g., warm, cool, or neutral. Used internally to adapt recipe generation.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Curvy</td><td style="padding: 10px 16px; border: 1px solid #333;">The adaptive B&amp;W profile whose exposure, contrast, and brightness parameters respond to the image’s own analysis data. More image-dependent than Strong.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Edge Density</td><td style="padding: 10px 16px; border: 1px solid #333;">A measure of how much fine detail and edge structure is present in the image. Used internally to adapt certain grading parameters.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;"><strong>Explore 9 Looks</strong></td><td style="padding: 10px 16px; border: 1px solid #333;">The Variations Grid mode that generates nine different grades simultaneously in a 3×3 grid for comparison.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;"><strong>Export</strong></td><td style="padding: 10px 16px; border: 1px solid #333;">The action of writing the graded image to a file (PNG or JPEG) at full original resolution via a native Save dialog.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Filmic Shoulder</td><td style="padding: 10px 16px; border: 1px solid #333;">The compression and rolloff applied at the highlight end of the tonal range, creating a smooth, film-like highlight transition.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Filmic Toe</td><td style="padding: 10px 16px; border: 1px solid #333;">The darkening and contrast shaping applied at the shadow end of the tonal range, lifting blacks slightly and adding cinematic depth.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Human Essence</td><td style="padding: 10px 16px; border: 1px solid #333;">The portrait profile with skin-aware adaptive grading. Draws from an internal library of named creative looks.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Jitter</td><td style="padding: 10px 16px; border: 1px solid #333;">The randomness injected into the engine when generating a new recipe. Controlled by the Pre-Drama slider.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Lock (grid cell)</td><td style="padding: 10px 16px; border: 1px solid #333;">A toggle on each Variations Grid cell that prevents it from being regenerated on the next Explore 9 run. Used to protect candidates you want to keep while regenerating others.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;"><strong>Manual Tweaks</strong></td><td style="padding: 10px 16px; border: 1px solid #333;">Right-panel additive deltas applied directly to individual recipe parameters. Separate from and additive to the global Adjustments layer.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;"><strong>My Looks</strong></td><td style="padding: 10px 16px; border: 1px solid #333;">Your personal library of saved grades. Each look stores the complete grade state: recipe, adjustments, tweaks, drama settings, and a thumbnail preview.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Personality / Profile</td><td style="padding: 10px 16px; border: 1px solid #333;">The creative engine character — e.g., Curvy, Golden Canopy, Human Essence. Determines the color science behavior of the engine for that session.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Post-Drama</td><td style="padding: 10px 16px; border: 1px solid #333;">A global intensity multiplier (~5 to +5) on recipe parameters, also applying a real-time contrast/saturation effect visible in both preview and export.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Pre-Drama</td><td style="padding: 10px 16px; border: 1px solid #333;">Controls how strong the random variation (jitter) is when generating a new recipe. Does not affect the currently displayed grade.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Preview</td><td style="padding: 10px 16px; border: 1px solid #333;">The center display showing the graded result in near-real time. Scaled for performance; export always uses full original resolution.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Promote</td><td style="padding: 10px 16px; border: 1px solid #333;">The action of applying a selected Variations Grid cell’s grade to the main workspace and exiting grid mode.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Random Recipe</td><td style="padding: 10px 16px; border: 1px solid #333;">A recipe generated by Randomize Look — unique to the combination of the current image’s analysis data and the active profile.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;"><strong>Randomize Look</strong></td><td style="padding: 10px 16px; border: 1px solid #333;">Generates one new recipe for the active profile. The primary "give me a new grade" action.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Recipe</td><td style="padding: 10px 16px; border: 1px solid #333;">The set of numeric parameters generated by the engine for a given profile and image. Forms the creative foundation of the grading stack.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Season</td><td style="padding: 10px 16px; border: 1px solid #333;">One of the four main profile groups: Summer, Spring, Autumn, Winter. Each season contains six profiles.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Single View</td><td style="padding: 10px 16px; border: 1px solid #333;">Default mode — one centered preview image showing the graded result. Active whenever Variations Grid is not open.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Skin Detection</td><td style="padding: 10px 16px; border: 1px solid #333;">The application’s ability to detect whether the image contains skin tones. Used to apply skin-protective grading behavior in portrait and seasonal profiles.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Split View</td><td style="padding: 10px 16px; border: 1px solid #333;">A before/after comparison mode: original image on the left, graded result on the right. Only available in single-view mode.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;">Strong</td><td style="padding: 10px 16px; border: 1px solid #333;">The consistent filmic B&amp;W profile with predictable, repeatable cinematic character. Results vary less between images than Curvy.</td></tr>
          <tr><td style="padding: 10px 16px; border: 1px solid #333;"><strong>Variations Grid</strong></td><td style="padding: 10px 16px; border: 1px solid #333;">The 3×3 display mode activated by Explore 9 Looks, showing nine different grades simultaneously for comparison. Header badge displays "Variations Grid" when active.</td></tr>
        </tbody>
      </table>
    `
  },

];

export default manualContent;