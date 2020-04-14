// loading DOM of directory
fetch('https://menoumemazi.org/wp-content/themes/ekko-child/js/react/prod/')
    .then(
        (response) => {
            return response.text();
        }
    ).then(
        (html) => {

            var doc = new DOMParser().parseFromString(html, 'text/html');

            // making a new script in the native html DOM
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';

            var LinkList = doc.links;
            var i;

            for (i = 5; LinkList.length > i; i++) {
                var fn = LinkList[i].innerText;
                const sids = '#' + fn.replace('.js', '');
                if (document.querySelector(sids) != null) {
                    script.src = 'https://menoumemazi.org/wp-content/themes/ekko-child/js/react/prod/' + fn;
                }

            }
            head.appendChild(script);
        }
    )
