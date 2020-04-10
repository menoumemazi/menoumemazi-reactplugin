'use strict';

var e = React.createElement;

class CultureFinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoadedItems: false,
            isLoadedTerms: false,
            items: [],
            itemsSafe: [],
            typeCultures: [],
            selectedType: ''
        };
    }
    componentDidMount() {
        //Get Culture Items
        fetch("https://menoumemazi.org/wp-json/wp/v2/culture?per_page=100&_embed=1")
            .then(res => res.json())
            .then(
                (result) => {
                    result.forEach(
                        (item) => {
                            //Map Culture Types
                            item.typeTerms = item._embedded['wp:term'][0].filter(obj => {
                                return obj.taxonomy === 'typeculture';
                            });
                            //Force Target Blank
                            var pattern = '<a href=';
                            var re = new RegExp(pattern, "g");
                            item.content.rendered = item.content.rendered.replace(re, '<a target="_blank" href=');
                        }
                    );

                    this.setState({
                        isLoadedItems: true,
                        items: result,
                        itemsSafe: result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoadedItems: true,
                        error
                    });
                }
            )

        //Get all Field compaints
        fetch("https://menoumemazi.org/wp-json/wp/v2/all-terms?term=typeculture")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoadedTerms: true,
                        typeCultures: result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoadedTerms: true,
                        error
                    });
                }
            );
    }
    //Filter Types
    filterTypesClear() {
        this.setState({
            items: this.state.itemsSafe,
            selectedType: '',
        });
    }
    filterTypesSelect(typeTemp) {
        var tempItems = this.state.itemsSafe.filter(item => {
            var hasType = false;
            item.typeTerms.map(term => {
                if (term.name === typeTemp) {
                    hasType = true;
                }
            })
            return hasType;
        });
        this.setState({
            items: tempItems,
            selectedType: typeTemp,
            input: ''
        });
    }
    //Render
    render() {
        const { error, isLoadedItems, isLoadedTerms, items, typeCultures, selectedType } = this.state;
        if (error) {
            console.log(error);
            return ('Λαθος');
        } else if (!isLoadedItems || !isLoadedTerms) {
            return ('Φορτώνει');
        } else {
            //Map Terms to array from Object
            var arraytypeCultures = [];
            Object.keys(typeCultures).forEach(function (key) {
                arraytypeCultures.push(typeCultures[key]);
            });
            //Render
            return (
                e("div", {
                    className: "finder-container culture-finder-container row"
                }, e("div", {
                    className: "col-md-4 finder-filter"
                }, e("div", {
                    className: "row"
                }, e("div", {
                    className: "col-md-12"
                }, e("label", null, "Επιλέξτε Έιδος"), e("div", {
                    className: "tag-container"
                }, e("span", {
                    className: selectedType === '' ? "active" : "",
                    onClick: this.filterTypesClear.bind(this)
                }, "Όλα"), arraytypeCultures.map((term) => {
                    return e("span", {
                        className: selectedType === term.name ? "active" : "",
                        onClick: this.filterTypesSelect.bind(this, term.name),
                        key: term.term_id
                    }, term.name);
                }))))), e("div", {
                    className: "col-md-8 finder-content cultureItems masonry packed-masonry"
                }, items.map(function (item) {
                    return e("div", {
                        className: "row masonry-item",
                        key: item.id
                    }, e("div", {
                        className: "col-md-12"
                    }, /* e("a", {
                        href: item.link,
                        target: "_blank",
                        title: item.title.rendered
                    }, */ e("div", {
                        className: "culture-item finder-item"
                    }, e("h4", null, item.title.rendered), e("div", {
                        className: "info"
                    }, e("span", {
                        className: "term type"
                    }, item.typeTerms.map(function (term) {
                        return e("span", {
                            key: term.id
                        }, term.name);
                    }))), e("div", {
                        className: "desc",
                        dangerouslySetInnerHTML: {
                            __html: item.content.rendered
                        }
                    }))))
                    //)
                    ;
                })))
            );
        }
    }
}

const domContainer = document.querySelector('#culture-finder');
ReactDOM.render(e(CultureFinder), domContainer);