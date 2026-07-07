/* ---------------------------------------------------------
   Photoshop Export Bridge (UXP Safe)
   ---------------------------------------------------------
   Sends a canvas bitmap to Photoshop if available.
   Gracefully degrades when running in a normal browser.
--------------------------------------------------------- */

export async function sendToPhotoshop(canvas: HTMLCanvasElement) {
  try {
    const photoshop = (window as any).photoshop;

    // No Photoshop / UXP environment
    if (!photoshop || !photoshop.core) {
      console.warn("Photoshop API not detected. Running in browser mode.");
      alert("Photoshop connection not available.");
      return;
    }

    const { core } = photoshop;

    // Convert canvas → PNG Blob
    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b as Blob), "image/png")
    );

    const arrayBuffer = await blob.arrayBuffer();

    // Open PNG in Photoshop
    await core.executeAsModal(async () => {
      await photoshop.app.open(arrayBuffer, {
        extension: "png",
      });
    });

    console.log("Image successfully sent to Photoshop.");
  } catch (err) {
    console.error("Failed to send image to Photoshop:", err);
    alert("Failed to send image to Photoshop. Check console for details.");
  }
}