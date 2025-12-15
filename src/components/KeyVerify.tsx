import { useEffect, useState } from "react";
import supabase from "../supabase/client"; // adjust path if needed

export default function KeyVerify() {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!window.AroLinks) return;

    window.AroLinks.init({
      container: "#arolinks-widget",
      keyUrl: "https://arolinks.lovable.app",
      onVerified: async function (data) {
        console.log("AroLinks verified:", data);

        // Save to Supabase
        const { error } = await supabase
          .from("key_verifications")
          .insert([{ aro_key: data.key, verified_at: new Date() }]);

        if (!error) setVerified(true);
      },
    });
  }, []);

  return (
    <div>
      {!verified ? (
        <div id="arolinks-widget"></div>
      ) : (
        <div>
          <h2>Premium Content Unlocked</h2>
          {/* show protected content here */}
        </div>
      )}
    </div>
  );
}
