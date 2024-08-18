let url = "https://www.sefaria.org/api/calendars?diaspora=1&custom=ashkenazi&timezone=Europe%2FParis"; // URL de l'API des calendriers
$.get(url, function(data) {
    // Récupération du jour de la semaine (0 pour dimanche, 1 pour lundi, etc.)
    let dayOfWeek = new Date().getDay();
    let aliyahIndex = dayOfWeek; // Correspondant au jour de la semaine
    let ordre = "Premiere montée"; // Initialisation du type de montée par défaut
    // Détermination de l'ordre de la montée selon le jour de la semaine
    if (aliyahIndex === 0) {
        ordre = "Premiere montée";
    } else if (aliyahIndex === 1) {
        ordre = "Deuxieme montée";
    } else if (aliyahIndex === 2) {
        ordre = "Troisieme montée";
    } else if (aliyahIndex === 3) {
        ordre = "Quatrieme montée";
    } else if (aliyahIndex === 4) {
        ordre = "Cinquieme montée";
    } else if (aliyahIndex === 5) {
        ordre = "Sixieme montée";
    } else {
        ordre = "Septieme montée";
    }

    let tanakhItem = data.calendar_items.find(item => item.category === "Tanakh"); // Récupération de l'item Tanakh
    if (tanakhItem) {
        let parashaUrl = tanakhItem.extraDetails.aliyot[aliyahIndex]; // URL de la montée spécifique
        let parashaName = tanakhItem.displayValue.en; // Nom de la parasha en anglais
        let parashaNameHebrew = tanakhItem.displayValue.he; // Nom de la parasha en hébreu

        let apiUrl = "https://www.sefaria.org/api/texts/" + parashaUrl + "?context=0&ven=Bible%20du%20Rabbinat%201899%20[fr]"; // URL de l'API pour le texte de la montée
        let Comurl = "https://www.sefaria.org/api/texts/Rashi_on_" + parashaUrl + "?context=0&commentary=0"; // URL de l'API pour le commentaire de Rashi

        $.get(Comurl, function(dataCom) { // Récupération des commentaires de Rashi
            let commentaryArray = dataCom.text; // Tableau des commentaires
            let commentaryHtml = commentaryArray.map(comment => `<p>${comment}</p>`).join(''); // Conversion en HTML

            // Affichage initial des commentaires
            let commentaryDiv = document.getElementById("commentary");
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
        $.get(apiUrl, function(textData) {
            // Remplacement des virgules par des espaces
            let textHebrew = textData.he.join(" ").replace(/,/g, ' '); // Texte en hébreu avec espace comme séparateur
            let textFrench = textData.text.join(" ").replace(/,/g, ' '); // Texte en français avec espace comme séparateur
            let livre = textData.titleVariants[6]; // Nom du livre
            let referencedulivre = textData.sections + " à " + textData.toSections; // Référence du passage

            // Affichage des informations de la montée
            let referenceHebrew = `${parashaNameHebrew} - ${textData.heRef || "Référence non disponible"}`;
            let referenceFrench = `${parashaName} - ${livre} - ${referencedulivre} - ${ordre}`;

            // Affichage dans les éléments HTML correspondants
            let element1 = document.getElementById("affichage1");
            element1.innerHTML = "<p><strong> " + referenceHebrew + "</strong></p>" + textHebrew;

            let element2 = document.getElementById("affichage2");
            element2.innerHTML = "<br/><p><strong> " + referenceFrench + "</strong> </p>" + textFrench;

        }).fail(function() {
            console.error("Failed to fetch Parasha text from text API");
            document.getElementById("affichage1").innerHTML = "Failed to fetch Parasha text.";
            document.getElementById("affichage2").innerHTML = "Failed to fetch Parasha text.";
        });
    } else {
        document.getElementById("affichage1").innerHTML = "Tanakh item not found in the calendar.";
        document.getElementById("affichage2").innerHTML = "Tanakh item not found in the calendar.";
    }
}).fail(function() {
    console.error("Failed to fetch data from calendar API");
    document.getElementById("affichage1").innerHTML = "Failed to fetch calendar data.";
    document.getElementById("affichage2").innerHTML = "Failed to fetch calendar data.";
});
