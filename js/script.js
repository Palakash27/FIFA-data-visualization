// Load CSV file
d3.csv("data/data.csv", function (error, allData) {
    console.log("All Data: ", allData);
    window.allData = allData;
    let lineChartCsv = "x,y\n";
    let ageObj = {};
    allData.forEach((player) => {
        let age = player.age;
        if (!ageObj[age]) {
            ageObj[age] = 0;
        }
        ageObj[age] += 1;
    });

    Object.keys(ageObj).forEach((age) => {
        lineChartCsv += `${age},${ageObj[age]}\n`;
    });

    // console.log(lineChartCsv);
    //copy past content of lineChartCsv to data/lineChart.csv

    let nationalityObj = {};
    allData.forEach((player) => {
        let nationality = player.nationality;
        nationalityObj[nationality] = true;
    });

    let nationalityArray = "[";
    Object.keys(nationalityObj).forEach((nationality) => {
        nationalityArray += `'${nationality}',`;
    });
    nationalityArray += "]";
    // console.log(nationalityArray);
    //copy past content of nationalityArray to nationalityArray
});

d3.csv("data/slicedData.csv", function (error, allData) {
    let clusterCsv = "id,value\nclub,\n";
    let clubObj = {};
    allData.forEach((player) => {
        let playerClub = player.club.replaceAll(".", " ");
        if (!clubObj[playerClub]) {
            clusterCsv += `club.${playerClub},\n`;
            clubObj[playerClub] = true;
        }
        clusterCsv += `club.${playerClub}.${player.long_name.replaceAll(
            ".",
            " "
        )},1\n`;
    });

    // console.log(Object.keys(clusterCsv));
    //copy past content of clusterCsv to data/cluster.csv
});

d3.csv("data/slicedData.csv", function (error, allData) {
    allData.forEach(function (d) {
        d.overall = +d.overall;
        d.wage_eur = +d.wage_eur;
    });

    const shuffledData = [...allData].sort(() => 0.5 - Math.random());
    let slicedShuffledData = shuffledData.slice(0, 20);

    window.barChart = new BarChart(slicedShuffledData);
    barChart.updateBarChart("overall");

    const donutChartData = {};
    slicedShuffledData = shuffledData.slice(0, 10);
    slicedShuffledData.forEach((player) => {
        donutChartData[player.short_name] = player.wage_eur;
    });

    window.donutChart = new DonutChart(donutChartData);
    donutChart.updateDonutChart();

    window.cluster = new Cluster();
    cluster.createCluster();
});

function chooseData() {
    let dataFile = document.getElementById("dataset").value;

    barChart.updateBarChart(dataFile);
}
