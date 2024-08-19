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

            document.getElementById("affichage3").innerHTML = `<p><strong>${referenceHebrew}</strong></p>${textHebrew}`;
            document.getElementById("affichage4").innerHTML = `<p><strong>${referenceFrench}</strong></p>${textFrench}`;

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
                    document.getElementById("commentary2").innerHTML = "Commentary not available.";
                }
            });

        });
    } else {
        document.getElementById("affichage3").innerHTML = "Mishna item not found in the calendar.";
        document.getElementById("affichage4").innerHTML = "Mishna item not found in the calendar.";
    }
});




let url = "https://www.sefaria.org/api/calendars?diaspora=1&custom=ashkenazi&timezone=Europe%2FParis"; // URL de l'API des calendriers
$.get(url, function(data) {


    let mishnahItem = data.calendar_items.find(item => item.category === "Mishnah"); // Récupération de l'item Tanakh
    if (mishnahItem) {
        let mishnahUrl = mishnahhItem
        let mishnahName = mishnahItem.displayValue.en; // Nom de la parasha en anglais
        let mishnahNameHebrew = mishnahItem.displayValue.he; // Nom de la parasha en hébreu

        let apiUrl2 = "https://www.sefaria.org/api/texts/" + mishnahUrl + "?context=0&ven=Le Talmud de Jérusalem, traduit par Moise Schwab, 1878-1890 [fr]"; // URL de l'API pour le texte de la montée
        let Comurl2 = "https://www.sefaria.org/api/texts/Rashi_on_" + mishnahUrl + "?context=0&commentary=0"; // URL de l'API pour le commentaire de Rashi

        $.get(Comurl2, function(dataCom) { // Récupération des commentaires de Rashi
            let commentaryArray = dataCom.text; // Tableau des commentaires
            let commentaryHtml = commentaryArray.map(comment => `<p>${comment}</p>`).join(''); // Conversion en HTML

            // Affichage initial des commentaires
            let commentaryDiv = document.getElementById("commentary2");
            commentaryDiv.innerHTML = "<p><strong>Commentaires de Rashi :</strong></p>" + commentaryHtml;
            commentaryDiv.style.display = "none"; // Les commentaires sont masqués par défaut

            // Création et ajout du bouton pour afficher/masquer les commentaires
            let toggleButton = document.createElement("button");
            toggleButton.textContent = "Commentaires de Rashi";
            toggleButton.onclick = function() {
                if (commentaryDiv.style.display === "none") {
                    commentaryDiv.style.display = "block";
                } else {
                    commentaryDiv.style.display = "none";
                }
            };

            // Vérifier si commentaryDiv a déjà un parent (noeud parent)
            if (commentaryDiv.parentNode) {
                commentaryDiv.parentNode.insertBefore(toggleButton, commentaryDiv); // Insérer le bouton avant commentaryDiv
            } else {
                // Si commentaryDiv n'a pas de parent, insérer à la fin du corps du document
                document.body.appendChild(toggleButton);
            }

        }).fail(function() {
            console.error("Failed to fetch Rashi's commentary");
        });

        // Récupération du texte de la montée
        $.get(apiUrl2, function(textData) {
            // Remplacement des virgules par des espaces
            let textHebrew = textData.he.join(" ").replace(/,/g, ' '); // Texte en hébreu avec espace comme séparateur
            let textFrench = textData.text.join(" ").replace(/,/g, ' '); // Texte en français avec espace comme séparateur
            let livre = textData.titleVariants[6]; // Nom du livre
            let referencedulivre = textData.sections + " à " + textData.toSections; // Référence du passage

            // Affichage des informations de la montée
            let referenceHebrew = `${mishnahNameHebrew} - ${textData.heRef || "Référence non disponible"}`;
            let referenceFrench = `${mishnahName} - ${livre} - ${referencedulivre} - ${ordre}`;

            // Affichage dans les éléments HTML correspondants
            let element1 = document.getElementById("affichage3");
            element1.innerHTML = "<p><strong> " + referenceHebrew + "</strong></p>" + textHebrew;

            let element2 = document.getElementById("affichage4");
            element2.innerHTML = "<br/><p><strong> " + referenceFrench + "</strong> </p>" + textFrench;

        }).fail(function() {
            console.error("Failed to fetch Parasha text from text API");
            document.getElementById("affichage3").innerHTML = "Failed to fetch Parasha text.";
            document.getElementById("affichage4").innerHTML = "Failed to fetch Parasha text.";
        });
    } else {
        document.getElementById("affichage3").innerHTML = "Tanakh item not found in the calendar.";
        document.getElementById("affichage4").innerHTML = "Tanakh item not found in the calendar.";
    }
}).fail(function() {
    console.error("Failed to fetch data from calendar API");
    document.getElementById("affichage3").innerHTML = "Failed to fetch calendar data.";
    document.getElementById("affichage4").innerHTML = "Failed to fetch calendar data.";
});






