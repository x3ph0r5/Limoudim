$.get(url, function(data) {
    console.log("Data from calendar API:");
    console.dir(data); // Permet de voir la structure de l'objet

    let mishnaItem = data.calendar_items.find(item => item.category === "Mishnah");
    console.log("Mishna item found:");
    console.dir(mishnaItem);

    if (mishnaItem) {
        let mishnaUrl = mishnaItem.url;
        let apiUrl = "https://www.sefaria.org/api/texts/" + mishnaUrl + "?context=0&ven=Le Talmud de Jérusalem, traduit par Moise Schwab, 1878-1890 [fr]";
        let comUrl = "https://www.sefaria.org/api/texts/Bartenura_on_" + mishnaUrl + "?context=0&commentary=0";

        $.get(apiUrl, function(textData) {
            console.log("Data from text API:");
            console.dir(textData);

            let textHebrew = textData.he || "Text in Hebrew not available.";
            let textFrench = textData.text || "Text in French not available.";

            let referenceHebrew = textData.heRef || "Référence non disponible";
            let referenceFrench = textData.ref || "Référence non disponible";

            let element1 = document.getElementById("affichage3");
            element1.innerHTML = "<p><strong> " + referenceHebrew + "</strong></p>" + textHebrew;

            let element2 = document.getElementById("affichage4");
            element2.innerHTML = "<p><strong> " + referenceFrench + "</strong></p>" + textFrench;

            // Fetching the commentary data after setting up the Mishna text
            $.get(comUrl, function(dataCom) {
                console.log("Data from commentary API:");
                console.dir(dataCom);

                if (dataCom && Array.isArray(dataCom.text)) {
                    let commentaryHtml = dataCom.text.map(comment => `<p>${comment}</p>`).join('');

                    let commentaryElement = document.getElementById("commentary2");
                    commentaryElement.innerHTML = "<h2>Commentaires de Bartenoura</h2>" + commentaryHtml;

                    // Ensure the commentary is hidden initially
                    commentaryElement.style.display = "none";
                    let toggleButton = document.getElementById("toggleCommentaryButton");
                    toggleButton.style.display = "block";
                    toggleButton.textContent = "Afficher les commentaires de Bartenoura";

                    // Set up the click event handler for the button
                    toggleButton.onclick = function() {
                        if (commentaryElement.style.display === "none") {
                            commentaryElement.style.display = "block";
                            toggleButton.textContent = "Masquer les commentaires de Bartenoura";
                        } else {
                            commentaryElement.style.display = "none";
                            toggleButton.textContent = "Afficher les commentaires de Bartenoura";
                        }
                    };
                } else {
                    console.error("Commentary data is not in the expected format or not available.");
                    document.getElementById("commentary2").innerHTML = "Failed to fetch commentary.";
                }
            }).fail(function() {
                console.error("Failed to fetch commentary from API");
                document.getElementById("commentary2").innerHTML = "Failed to fetch commentary.";
            });

        }).fail(function() {
            console.error("Failed to fetch Mishna text from text API");
            document.getElementById("affichage3").innerHTML = "Failed to fetch Mishna text.";
            document.getElementById("affichage4").innerHTML = "Failed to fetch Mishna text.";
        });
    } else {
        document.getElementById("affichage3").innerHTML = "Mishna item not found in the calendar.";
        document.getElementById("affichage4").innerHTML = "Mishna item not found in the calendar.";
    }
}).fail(function() {
    console.error("Failed to fetch data from calendar API");
    document.getElementById("affichage3").innerHTML = "Failed to fetch calendar data.";
    document.getElementById("affichage4").innerHTML = "Failed to fetch calendar data.";
});
