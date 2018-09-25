// ==UserScript==
// @name         github-tab-all
// @namespace    https://github.com/turnon/github_tab_all
// @version      0.0.1
// @description  github_tab_all
// @author       block24block@gmail.com
// @match        https://github.com/*?tab=*&all
// @grant        none
// ==/UserScript==
(function () {
    async function load_next(selectors) {
        let parser = new DOMParser(),
            ul = document.querySelector(selectors.list)

        function next_url(doc) {
            if (typeof (doc) === 'string') {
                doc = parser.parseFromString(doc, 'text/html')
            }
            return doc.querySelector('.pagination *:last-child').href
        }

        function append_page(doc) {
            doc = parser.parseFromString(doc, 'text/html')
            let lis = doc.querySelectorAll(selectors.items)
            for (let i = 0; i < lis.length; i++) {
                ul.appendChild(lis[i])
            }
        }

        let url = next_url(document)

        while (url) {
            let data = await fetch(url).then(resp => resp.text())
            url = next_url(data)
            append_page(data)
        }
    }

    let tabs = {
            repositories: {
                list: '#user-repositories-list > ul',
                items: '#user-repositories-list li'
            },
            stars: {
                list: '#js-pjax-container .position-relative:last-child',
                items: '#js-pjax-container .position-relative:last-child .d-block'
            }
        },
        tab = window.location.search.replace(/\?tab\=(.*)\&.*/, "$1"),
        selectors = tabs[tab]

    selectors && load_next(selectors)
})()