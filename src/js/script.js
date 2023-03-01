const CHART_BAR_URL = "src/templates/chart-post.html";
const PRICE_TAG_URL  = "src/templates/price-tag.html";
const DATA_PATH = "data.json";

const fetchElement = async (elemURL, format = 'json') => {
  format = format.toLowerCase();
  try {
    let res_data;
    let response = await fetch(elemURL);
    switch (format) {
      case 'json':
        res_data = await response.json();
        break;
      case 'html':
        let parser = new DOMParser();
        res_data = parser.parseFromString(await response.text(), 'text/html'); 
        break;
      }
      return res_data;
    } catch (error) {
      console.log("Fetch error: " + error);
    }
  }

const main = async () => {
  const CHART_CONTAINER = document.querySelector('.expenses-chart__chart');
  const CHART_DATA = await fetchElement(DATA_PATH, 'json');
  const MAX_VALUE = ( function (data) {
    let min_value = data[0].amount;
    for (let i = 0; i < data.length; i++) {
      const value = data[i].amount;
      if (value >= min_value) {
        min_value = value;
      }
      else{
        continue;
      }
    }
    return min_value;
  })(CHART_DATA);
  
  for (let i = 0; i < CHART_DATA.length; i++) {
    const CHART_ELEMENT = (await fetchElement(CHART_BAR_URL, 'html')).querySelector('.expenses-chart__chart-bar-element');
    const day = CHART_DATA[i].day;
    const spending = CHART_DATA[i].amount;
    
    CHART_CONTAINER.append(CHART_ELEMENT);
    
    let bar_height = ((spending / MAX_VALUE) * 150);
    CHART_ELEMENT.querySelector('.expenses-chart__day-of-week').innerText = day;
    CHART_ELEMENT.querySelector('.expenses-chart__bar').style.height = bar_height.toString() + 'px';
    CHART_ELEMENT.querySelector('.expenses-chart__price-tag').innerText = '$' + spending.toString();
    CHART_ELEMENT.querySelector('.expenses-chart__price-tag').style.top = (130 - bar_height).toString() + 'px';
    CHART_ELEMENT.querySelector('.expenses-chart__price-tag').style.visibility = 'hidden';
    
    if (spending >= MAX_VALUE) {
      CHART_ELEMENT.querySelector('.expenses-chart__bar').classList.add('expenses-chart__bar--highest');
    }

    CHART_ELEMENT.addEventListener('click', (ev) => {
      let price_tag = ev.target.parentElement.querySelector('.expenses-chart__price-tag');
      if (price_tag.style.visibility === 'visible') {
        price_tag.style.visibility = 'hidden';
      }
      else {
        price_tag.style.visibility = 'visible';
      }
    })
  }
}

main();
