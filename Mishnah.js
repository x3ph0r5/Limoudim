$(document).ready(function() {
    let url = "https://www.sefaria.org/api/calendars?diaspora=1&custom=ashkenazi&timezone=Europe%2FParis";

    $.get(url, function(data) {
        let mishnahItem = data.calendar_items.find(item => item.category === "Mishnah");
        
        if (mishnahItem) {
            let mishnahUrl = mishnahItem.url;
            let mishnahName = mishnahItem.displayValue.en;
            let mishnahNameHebrew = mishnahItem.displayValue.he;

            let apiUrl2 = `https://www.sefaria.org/api/texts/${mishnahUrl}?context=0&ven=Le Talmud de Jérusalem, traduit par Moise Schwab, 1878-1890 [fr]`;
            let comUrl2 = `https://www.sefaria.org/api/texts/Rashi_on_${mishnahUrl}?context=0&commentary=0`;

            $.get(apiUrl2, function(textData) {
                let element1 = document.getElementById("affichage3");
                let element2 = document.getElementById("affichage4");

                if (element1 && element2) {
                    let textHebrew = (textData.he || []).join(" ").replace(/,/g, ' ');
                    let textFrench = (textData.text || []).join(" ").replace(/,/g, ' ');

                    let referenceHebrew = `${mishnahNameHebrew} - ${textData.heRef || "Référence non disponible"}`;
                    let referenceFrench = `${mishnahName} - ${textData.titleVariants[6]} - ${textData.sections} à ${textData.toSections}`;

                    element1.innerHTML = `<p><strong>${referenceHebrew}</strong></p>${textHebrew}`;
                    element2.innerHTML = `<br/><p><strong>${referenceFrench}</strong></p>${textFrench}`;
                } else {
                    console.error("Un ou plusieurs éléments nécessaires sont manquants dans le DOM.");
                }
            });

            $.get(comUrl2, function(dataCom) {
                let commentaryDiv = document.getElementById("commentary2");

                if (commentaryDiv) {
                    let commentaryArray = dataCom.text || [];
                    let commentaryHtml = commentaryArray.map(comment => `<p>${comment}</p>`).join('');

                    commentaryDiv.innerHTML = `<p><strong>Commentaires de Rashi :</strong></p>${commentaryHtml}`;
                    commentaryDiv.style.display = "none";

                    let toggleButton = document.createElement("button");
                    toggleButton.textContent = "Commentaires de Rashi";
                    toggleButton.onclick = function() {
                        commentaryDiv.style.display = (commentaryDiv.style.display === "none") ? "block" : "none";
                    };

                    commentaryDiv.parentNode.insertBefore(toggleButton, commentaryDiv);
                } else {
                    console.error("L'élément commentaryDiv est manquant.");
                }
            });

        } else {
            console.error("Mishnah item not found in the calendar.");
        }
    });
});
