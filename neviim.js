     function getDayOfYear(date) {
            const start = new Date(date.getFullYear(), 0, 0);
            const diff = date - start;
            const oneDay = 1000 * 60 * 60 * 24;
            const day = Math.floor(diff / oneDay);
            return day;
        }

        const today = new Date();
        const dayOfYear = getDayOfYear(today);
        console.log("Jour de l'année:", dayOfYear);

        let prophete 


        if (dayOfYear <= 24) {
            prophete = "Joshua." + dayOfYear;
        } else if (dayOfYear <= 45) {
            prophete = "Judges." + (dayOfYear - 24);
        } else if (dayOfYear <= 76) {
            prophete = "I_Samuel." + (dayOfYear - 45);
        } else if (dayOfYear <= 100) {
            prophete = "II_Samuel." + (dayOfYear - 76);
        } else if (dayOfYear <= 122) {
            prophete = "I_Kings." + (dayOfYear - 100);
        } else if (dayOfYear <= 146) {
            prophete = "II_Kings." + (dayOfYear - 122);
        } else if (dayOfYear <= 213) {
            prophete = "Isaiah." + (dayOfYear - 147);
        } else if (dayOfYear <= 265) {
            prophete = "Jeremiah." + (dayOfYear - 213);
        } else if (dayOfYear <= 313) {
            prophete = "Ezekiel." + (dayOfYear - 265);
        } else if (dayOfYear <= 327) {
            prophete = "Hosea." + (dayOfYear - 313);
        } else if (dayOfYear <= 331) {
            prophete = "Joel." + (dayOfYear - 327);
        } else if (dayOfYear <= 340) {
            prophete = "Amos." + (dayOfYear - 331);
        } else if (dayOfYear === 341) {
            prophete = "Obadiah.1";
        } else if (dayOfYear <= 345) {
            prophete = "Jonah." + (dayOfYear - 341);
        } else if (dayOfYear <= 352) {
            prophete = "Micah." + (dayOfYear - 345);
        } else if (dayOfYear === 353) {
            prophete = "Nahum.1-3";
        } else if (dayOfYear === 354) {
            prophete = "Habakkuk.1-3";
        } else if (dayOfYear === 355) {
            prophete = "Zephaniah.1-3";
        } else if (dayOfYear === 356) {
            prophete = "Haggai.1-2";
        } else if (dayOfYear === 357) {
            prophete = "Zechariah.1-2";
        } else if (dayOfYear === 358) {
            prophete = "Zechariah.3-4";
        } else if (dayOfYear === 359) {
            prophete = "Zechariah.5-6";
        } else if (dayOfYear === 360) {
            prophete = "Zechariah.7-8";
        } else if (dayOfYear === 361) {
            prophete = "Zechariah.9-10";
        } else if (dayOfYear === 362) {
            prophete = "Zechariah.11-12";
        } else if (dayOfYear === 363) {
            prophete = "Zechariah.13";
        } else if (dayOfYear === 364) {
            prophete = "Zechariah.14";
        } else if (dayOfYear === 365) {
            prophete = "Malachi.1-3";
        } else {
            prophete = "Autre";
        }

        console.log("Prophète:", prophete);

        function buttonClickGET4() {
            if (prophete === "Autre") {
                console.log("Pas de lecture de prophète défini pour ce jour de l'année.");
                return;
            }

            let urlNev = "https://www.sefaria.org/api/texts/" + prophete + "?context=0&ven=Bible%20du%20Rabbinat%201899%20[fr]";
            console.log("URL:", urlNev); // Ajout d'un log pour l'URL

            $.get(urlNev, function(data) {
                console.log("Data received:", data.ref); // Affichage de la réponse complète pour le débogage
                console.log(data);

                let textFrench = data.text; // Supposition que 'text' contient le texte en français
                let textHebrew = data.he; // Supposition que 'he' contient le texte en hébreu

                let referencedulivre = data.sectionRef || "Référence non disponible";
                let referenceHebrew = `${data.heRef || "Référence hébraïque non disponible"}`;
                let referenceFrench = `${referencedulivre}`;

                // Mise à jour des éléments HTML avec les textes et références
                let element1 = document.getElementById("affichage7");
                element1.innerHTML = `<p><strong>${referenceHebrew}</strong></p><p>${textHebrew.join(" ")}</p>`;

                let element2 = document.getElementById("affichage8");
                element2.innerHTML = `<br/><p><strong>${referenceFrench}</strong></p><p>${textFrench.join(" ")}</p>`;

            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log("Erreur lors de la récupération des données:", textStatus, errorThrown);
            });

            document.getElementById("commentary4").innerHTML = '   ';
        }

        window.onload = function() {
            buttonClickGET4();
        };