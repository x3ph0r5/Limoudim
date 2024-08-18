    // Fonction pour récupérer et afficher les données
        function showHint(str) {
            var xhttp;
            if (str.length == 0) {
                document.getElementById("affichage1").innerHTML = "";
                return;
            }
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) { // Modifié pour vérifier le readyState
                    if (this.status == 200) {
                        document.getElementById("affichage5").innerHTML = this.responseText;
                        test();
                        HideShowNotes();
                        positionButton(); // Appeler cette fonction après avoir affiché les commentaires
                    } else {
                        document.getElementById("commentary3").innerHTML = 'Nous sommes désolés, la halakha du jour n\'a pas pu être chargée. Veuillez réessayer plus tard.';
                    }
                }
            };
            xhttp.open("GET", `https://ph.yhb.org.il/wp-content//plugins//db-connect//fr_py.php?date=${str}`, true);
            xhttp.send(null);
        }

        // Clear the existing button and commentary if present
        function clearButtonAndCommentary() {
            document.getElementById("btnCommentaires").remove();
            document.getElementById("commentary3").innerHTML = '';
        }

        // Fonction pour masquer ou afficher les commentaires
        function HideShowNotes() {
            var hr = document.getElementsByTagName("hr")[0];
            if (!hr) {
                console.error("Aucune ligne <hr> trouvée pour insérer les commentaires.");
                return;
            }

            var divN = hr.parentElement;
            var divs = divN.getElementsByTagName('div');

            // Ajout de la classe 'note' à tous les éléments div
            divN.id = 'AllNotes';
            for (const div of divs) {
                div.classList.add('note');
            }

            var brs = divN.getElementsByTagName('br');

            // Création du bouton "Affichage des commentaires"
            var button = document.createElement("button");
            button.textContent = 'Affichage des commentaires';
            button.id = "hideShow";
            button.setAttribute("onclick", "changeState()");

            // Ajout du bouton dans la div dédiée
            var buttonContainer = document.getElementById("button-container");
            if (!buttonContainer) {
                buttonContainer = document.createElement("div");
                buttonContainer.id = "button-container";
                document.body.appendChild(buttonContainer);
            }

            buttonContainer.innerHTML = ''; // Assurez-vous de vider d'abord le contenu existant
            buttonContainer.appendChild(button);

            // Masquer la ligne hr et les sauts de ligne br
            hr.style.display = "none";
            for (const br of brs) {
                br.style.display = 'none';
            }
            for (const div of divs) {
                div.style.display = 'none';
            }
        }

        // Fonction pour changer l'état des commentaires
        function changeState() {
            var divs = document.getElementsByClassName('note');
            var button = document.getElementById("hideShow");

            // Vérifier l'état actuel des éléments 'note'
            var firstDivDisplay = window.getComputedStyle(divs[0]).getPropertyValue('display');

            // Inverser l'état de tous les éléments 'note'
            if (firstDivDisplay === "none") {
                for (const div of divs) {
                    div.style.display = 'block';
                }
                button.textContent = 'Masquer les commentaires';
            } else {
                for (const div of divs) {
                    div.style.display = "none";
                }
                button.textContent = 'Affichage des commentaires';
            }

            positionButton(); // Réajuster la position du bouton après chaque changement d'état
        }

        // Fonction pour positionner le bouton en haut de la section des commentaires
        function positionButton() {
            var buttonContainer = document.getElementById("button-container");
            var hr = document.getElementsByTagName("hr")[0];
            if (!hr) {
                console.error("Aucune ligne <hr> trouvée pour positionner le bouton.");
                return;
            }

            var commentsSection = hr.nextElementSibling;

            // Insérer le bouton avant la section des commentaires
            commentsSection.parentNode.insertBefore(buttonContainer, commentsSection);
        }

        // Fonction de test
        function test() {
            document.addEventListener("DOMContentLoaded", function (e) {
                var div = document.getElementsByTagName("hr")[0].nextElementSibling;
                console.log(div);
            });
        }

        // Appeler la fonction showHint avec la date actuelle lorsque la page se charge
        document.addEventListener("DOMContentLoaded", function () {
            var index = Date.now(); // Date d'aujourd'hui en millisecondes depuis Epoch

            // Effacer le contenu de la div "commentary"
            document.getElementById("affichage5").innerHTML = '';
            document.getElementById("affichage6").innerHTML = '   ';
            document.getElementById("commentary3").innerHTML = '   ';

            // Appel initial pour afficher les données d'aujourd'hui
            showHint(index);
        });