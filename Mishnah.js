$(document).ready(function() {
    // Ton code ici



let url = "https://www.sefaria.org/api/calendars?diaspora=1&custom=ashkenazi&timezone=Europe%2FParis"; // URL de l'API des calendriers

$.get(url, function(data) {
    console.log(url);

    let mishnahItem = data.calendar_items.find(item => item.category === "Mishnah"); // Récupération de l'item Mishnah
    console.log(mishnahItem);

    if (mishnahItem) {
        let mishnahUrl = mishnahItem.url; // Correction pour récupérer la bonne URL
        let mishnahName = mishnahItem.displayValue.en; // Nom de la Mishnah en anglais
        console.log(mishnahName);
        let mishnahNameHebrew = mishnahItem.displayValue.he; // Nom de la Mishnah en hébreu

        let apiUrl2 = `https://www.sefaria.org/api/texts/${mishnahUrl}?context=0&ven=Le Talmud de Jérusalem, traduit par Moise Schwab, 1878-1890 [fr]`; // URL de l'API pour le texte de la Mishnah
        console.log(apiUrl2);
        let comUrl2 = `https://www.sefaria.org/api/texts/Rashi_on_${mishnahUrl}?context=0&commentary=0`; // URL de l'API pour le commentaire de Rashi

        // Récupération du texte de la Mishnah
        $.get(apiUrl2, function(textData) {
            console.log(textData); // Affichage des données reçues pour débogage
            let textHebrew = (textData.he || []).join(" ").replace(/,/g, ' ');
            let textFrench = (textData.text || []).join(" ").replace(/,/g, ' ');

            let referenceHebrew = `${mishnahNameHebrew} - ${textData.heRef || "Référence non disponible"}`;
            let referenceFrench = `${mishnahName} - ${textData.titleVariants[6]} - ${textData.sections} à ${textData.toSections}`;

            document.getElementById("affichage3").innerHTML = `<p><strong>${referenceHebrew}</strong></p>${textHebrew}`;
            document.getElementById("affichage4").innerHTML = `<br/><p><strong>${referenceFrench}</strong></p>${textFrench}`;
        });

        // Récupération des commentaires de Rashi
        $.get(comUrl2, function(dataCom) {
            console.log(dataCom); // Affichage des données reçues pour débogage
            let commentaryArray = dataCom.text || [];
            let commentaryHtml = commentaryArray.map(comment => `<p>${comment}</p>`).join('');

            let commentaryDiv = document.getElementById("commentary2");
            commentaryDiv.innerHTML = `<p><strong>Commentaires de Rashi :</strong></p>${commentaryHtml}`;
            commentaryDiv.style.display = "none"; // Les commentaires sont masqués par défaut

            let toggleButton = document.createElement("button");
            toggleButton.textContent = "Commentaires de Rashi";
            toggleButton.onclick = function() {
                commentaryDiv.style.display = (commentaryDiv.style.display === "none") ? "block" : "none";
            };

            commentaryDiv.parentNode.insertBefore(toggleButton, commentaryDiv);
        });

    } else {
        document.getElementById("affichage3").innerHTML = "Mishnah item not found in the calendar.";
        document.getElementById("affichage4").innerHTML = "Mishnah item not found in the calendar.";
    }
});
    });
