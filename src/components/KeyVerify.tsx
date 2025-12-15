import { useEffect } from "react";

export default function KeyVerify() {
  useEffect(() => {
    if (!window.AroLinks) return;

    window.AroLinks.init({
      container: "#arolinks-widget",
      keyUrl: "https://arolinks.lovable.app",

      onVerified: async function (data: any) {
        const deviceFingerprint =
          navigator.userAgent + screen.width + screen.height;

        try {
          const res = await fetch(
            "https://tweyvrhfjvqkweenlpgw.supabase.co/functions/v1/verify-access",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: import.meta.env.VITE_SUPABASE_ANON_KEY
              },
              body: JSON.stringify({
                key: data.key,
                deviceFingerprint
              })
            }
          );

          if (!res.ok) {
            alert("Key invalid / already used / wrong device");
            return;
          }

          // ✅ SUCCESS
          window.location.href = "/verify-success";

        } catch {
          alert("Verification failed");
        }
      }
    });
  }, []);

  return <div id="arolinks-widget"></div>;
}
