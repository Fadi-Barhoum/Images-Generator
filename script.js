const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");
const OPENAI_API_KEY = "";
let isImageGenerating = false;

const updateImgCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card");
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".dowmload-btn");

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () =>{
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        } 

    });
}

const generateImages = async (userPromot, userImgQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                prompt: userPromot,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if (!response.ok) throw new Error("Failed to generate images! Please try again.");

        const { data } = await response.json();
        updateImgCard([...data]);
    }catch (error){
        alert(error.message);
    }finally{
        isImageGenerating = false;
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();
    if (isImageGenerating) return;
    isImageGenerating = true;

    const userPromot = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    const imageCardMarkup = Array.from({length: userImgQuantity}, ()=> 
        `
        <div class="img-card loading">
            <img src="images/loader.svg" alt="image">
            <a href="#" class="dowmload-btn">
                <img src="images/download.svg" alt="download icom">
            </a>
        </div>
        `
    ).join("");

    imageGallery.innerHTML = imageCardMarkup;
    generateImages(userPromot, userImgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission);