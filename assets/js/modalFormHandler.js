document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("modal-enquiry-form");
    const button = document.getElementById("modal-submit-btn");

    if (!form || !button) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = form.querySelector("input[name='name']").value.trim();
        const email = form.querySelector("input[name='email']").value.trim();
        const mobile = form.querySelector("input[name='mobile']").value.trim();
        const countryCode = document.getElementById("countryCode").value;

        const phone = countryCode + mobile;

        if (!validateName(name) || !validateEmail(email) || !validatePhone(mobile)) {
            alert("Please fill all fields correctly.");
            return;
        }

        const originalText = button.innerText;
        button.innerText = "Submitting...";
        button.disabled = true;

        const datares = await getIpAddress();

        const utmSource = getParam("utm_source");
        const utmMedium = getParam("utm_medium");
        const utmCampaign = getParam("utm_campaign");
        const utmTerm = getParam("utm_term");
        const utmDevice =
            /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";

        try {
            const response = await axios.post(
                "https://leadapi.homebble.in/formdataRoute/getFormdata",
                {
                    name,
                    phone,
                    email,
                    utm_source: utmSource,
                    utm_medium: utmMedium,
                    utm_campaign: utmCampaign,
                    utm_term: utmTerm,
                    utm_device: utmDevice,
                    user_city: datares?.city || "",
                    user_country: datares?.country || "",
                    ip_address: datares?.ip || "",
                    project: "binghatti sky terraces",
                    allMails: [
                        // "dhinesh@markanthony.co.in",
                        // "markctkind@gmail.com",
                        // "santhoshrajan@markanthony.co.in"
                        "chandan.markanthony@gmail.com"
                    ]
                }
            );

            if (response.status === 200) {
                window.location.href = "thankyou.html";
            }

        } catch (error) {
            alert("Submission failed. Try again.");
            button.innerText = originalText;
            button.disabled = false;
        }
    });
});

// -------- HELPER FUNCTIONS --------

function validateName(n) { return n.length > 1; }
function validateEmail(e) { return /\S+@\S+\.\S+/.test(e); }
function validatePhone(p) { return p.replace(/\D/g, "").length >= 7; }

function getParam(k) {
    const params = new URLSearchParams(window.location.search);
    return params.get(k) || "";
}

async function getIpAddress() {
    try {
        const res = await axios.get("https://ipinfo.io/json", {
            headers: { Authorization: "Bearer b6690d547936a3" }
        });
        return res.data;
    } catch {
        return {};
    }
}
