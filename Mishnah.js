let url = "https://www.sefaria.org/api/calendars?diaspora=1&custom=ashkenazi&timezone=Europe%2FParis";

$.get(url, function(data) {
    let mishnahItem = data.calendar_items.find(item => item.category === "Mishnah");

    if (mishnahItem) {
        let mishnahUrl = mishnahItem.url;
        let mishnahName = mishnahItem.displayValue.en;
        let mishnahNameHebrew = mishnahItem.displayValue.he;

        let apiUrl = `https://www.sefaria.org/api/texts/${mishnahUrl}?context=0&ven=Le Talmud de Jérusalem, traduit par Moise Schwab, 1878-1890 [fr]`;
        let comUrl = `https://www.sefaria.org/api/texts/Rashi_on_${mishnahUrl}?context=0&commentary=0`;

        $.get(apiUrl, function(textData) {
            let textHebrew = (textData.he || []).join(" ").replace(/,/g, ' ');
            let textFrench = (textData.text || []).join(" ").replace(/,/g, ' ');
            let livre = textData.titleVariants[6];
            let referencedulivre = textData.sections + " à " + textData.toSections;

            let referenceHebrew = `${mishnahNameHebrew} - ${textData.heRef || "Référence non disponible"}`;
            let referenceFrench = `${mishnahName} - ${livre} - ${referencedulivre}`;

            document.getElementById("affichage3").innerHTML = `<p><strong>${referenceHebrew}</strong></p>${textHebrew}`;
            document.getElementById("affichage4").innerHTML = `<br/><p><strong>${referenceFrench}</strong></p>${textFrench}`;
        });

        $.get(comUrl, function(dataCom) {
            let commentaryHtml = (dataCom.text || []).map(comment => `<p>${comment}</p>`).join('');

            let commentaryDiv = document.getElementById("commentary2");
            commentaryDiv.innerHTML = `<p><strong>Commentaires de Rashi :</strong></p>${commentaryHtml}`;
            commentaryDiv.style.display = "none";

            let toggleButton = document.createElement("button");
            toggleButton.textContent = "Commentaires de Rashi";
            toggleButton.onclick = function() {
                commentaryDiv.style.display = (commentaryDiv.style.display === "none") ? "block" : "none";
            };

            commentaryDiv.parentNode.insertBefore(toggleButton, commentaryDiv);
        });
    } else {
        document.getElementById("affichage3").innerHTML = "Mishna item not found in the calendar.";
        document.getElementById("affichage4").innerHTML = "Mishna item not found in the calendar.";
    }
});
