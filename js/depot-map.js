(function () {
  "use strict";

  if (!document.getElementById("depotChart")) return;

  if (
    typeof am5 === "undefined" ||
    typeof am5map === "undefined" ||
    typeof am5geodata_worldLow === "undefined"
  ) {
    return;
  }

  am5.ready(function () {
    const root = am5.Root.new("depotChart");

    const tingiTheme = am5.Theme.new(root);
    tingiTheme.rule("InterfaceColors").setAll({
      background: am5.color(0x06192b),
      text: am5.color(0xffffff),
      primaryButton: am5.color(0x003366),
      primaryButtonHover: am5.color(0x0a477f),
      primaryButtonDown: am5.color(0x06192b),
      primaryButtonText: am5.color(0xffd800)
    });

    root.setThemes([am5themes_Animated.new(root), tingiTheme]);

    const navy = am5.color(0x003366);
    const deepNavy = am5.color(0x06192b);
    const yellow = am5.color(0xffd800);
    const paleYellow = am5.color(0xffe870);
    const white = am5.color(0xffffff);
    const isCompact = window.matchMedia("(max-width: 600px)").matches;
    const homeZoom = isCompact ? 5.15 : 4.2;

    const chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: "translateX",
      panY: "translateY",
      projection: am5map.geoMercator(),
      wheelY: "zoom",
      minZoomLevel: 1,
      maxZoomLevel: 8,
      homeGeoPoint: { longitude: 24.5, latitude: -29.2 },
      homeZoomLevel: homeZoom
    }));

    chart.chartContainer.get("background").setAll({
      fill: deepNavy,
      fillOpacity: 1
    });

    const polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      exclude: ["AQ"]
    }));

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0x123152),
      stroke: am5.color(0x31587c),
      strokeWidth: 0.5,
      strokeOpacity: 0.45,
      tooltipText: "{name}"
    });

    polygonSeries.events.on("datavalidated", function () {
      am5.array.each(polygonSeries.dataItems, function (dataItem) {
        if (dataItem.get("id") === "ZA") {
          dataItem.get("mapPolygon").setAll({
            fill: navy,
            stroke: yellow,
            strokeWidth: 1.4,
            strokeOpacity: 1
          });
        }
      });
    });

    const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color(0x4d6c8a),
      strokeOpacity: 0.18,
      strokeWidth: 0.5
    });

    const depots = [
      {
        id: "midrand",
        title: "Midrand",
        role: "Head Office & Primary Distribution Hub",
        region: "Gauteng",
        longitude: 28.128,
        latitude: -25.999,
        labelX: isCompact ? 44 : 18,
        labelY: isCompact ? 2 : -42,
        isHub: true
      },
      {
        id: "cape-town",
        title: "Cape Town",
        role: "Western Cape Regional Distribution Hub",
        region: "Western Cape",
        longitude: 18.424,
        latitude: -33.925,
        labelX: 0,
        labelY: -28
      },
      {
        id: "bloemfontein",
        title: "Bloemfontein",
        role: "Central South Africa Regional Depot",
        region: "Free State",
        longitude: 26.229,
        latitude: -29.085,
        labelX: -38,
        labelY: 30
      },
      {
        id: "mpumalanga",
        title: "Mpumalanga",
        role: "Mining & Industrial Operations Depot",
        region: "Mpumalanga",
        longitude: 30.985,
        latitude: -25.475,
        labelX: isCompact ? 60 : 58,
        labelY: isCompact ? -10 : -18
      },
      {
        id: "bapong",
        title: "Bapong",
        role: "North West Regional Depot",
        region: "North West",
        longitude: 27.481,
        latitude: -25.769,
        labelX: isCompact ? -50 : -46,
        labelY: -18
      },
      {
        id: "pietermaritzburg",
        title: "Pietermaritzburg",
        role: "KwaZulu-Natal Regional Depot",
        region: "KwaZulu-Natal",
        longitude: 30.392,
        latitude: -29.601,
        labelX: isCompact ? 62 : 54,
        labelY: 28
      },
      {
        id: "makhado",
        title: "Makhado",
        role: "Limpopo Northern Supply Depot",
        region: "Limpopo",
        longitude: 29.907,
        latitude: -23.043,
        labelX: 20,
        labelY: -38
      }
    ];

    const hub = depots[0];
    const routeSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
    routeSeries.mapLines.template.setAll({
      stroke: yellow,
      strokeWidth: 2,
      strokeOpacity: 0.62,
      lineType: "curved",
      tooltipText: "{title}"
    });

    routeSeries.data.setAll(depots.slice(1).map(function (depot) {
      return {
        title: "Midrand dispatch route > " + depot.title,
        geometry: {
          type: "LineString",
          coordinates: [
            [hub.longitude, hub.latitude],
            [depot.longitude, depot.latitude]
          ]
        }
      };
    }));

    const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
    pointSeries.bullets.push(function (_root, _series, dataItem) {
      const context = dataItem.dataContext;
      const container = am5.Container.new(root, {
        cursorOverStyle: "pointer",
        tooltipText: "[bold]{title}[/]\n{role}\n{region}",
        interactive: true
      });

      const pulse = container.children.push(am5.Circle.new(root, {
        radius: context.isHub ? 17 : 12,
        fill: yellow,
        fillOpacity: context.isHub ? 0.25 : 0.18
      }));

      pulse.animate({
        key: "scale",
        from: 1,
        to: 1.7,
        duration: 1800,
        easing: am5.ease.out(am5.ease.cubic),
        loops: Infinity
      });

      pulse.animate({
        key: "fillOpacity",
        from: context.isHub ? 0.28 : 0.2,
        to: 0,
        duration: 1800,
        easing: am5.ease.out(am5.ease.cubic),
        loops: Infinity
      });

      container.children.push(am5.Circle.new(root, {
        radius: context.isHub ? 9 : 7,
        fill: context.isHub ? yellow : white,
        stroke: yellow,
        strokeWidth: context.isHub ? 3 : 2
      }));

      container.children.push(am5.Label.new(root, {
        text: context.title,
        populateText: true,
        x: context.labelX || 0,
        centerX: am5.p50,
        y: context.labelY || (context.isHub ? -34 : -28),
        paddingTop: 4,
        paddingRight: 7,
        paddingBottom: 4,
        paddingLeft: 7,
        background: am5.RoundedRectangle.new(root, {
          fill: deepNavy,
          fillOpacity: 0.92,
          stroke: yellow,
          strokeOpacity: 0.45,
          cornerRadiusTL: 4,
          cornerRadiusTR: 4,
          cornerRadiusBR: 4,
          cornerRadiusBL: 4
        }),
        fill: white,
        fontSize: isCompact ? 10 : 12,
        fontWeight: "700"
      }));

      container.events.on("click", function () {
        const card = document.getElementById(context.id);
        if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      return am5.Bullet.new(root, { sprite: container });
    });

    pointSeries.data.setAll(depots.map(function (depot) {
      return {
        id: depot.id,
        title: depot.title,
        role: depot.role,
        region: depot.region,
        isHub: depot.isHub,
        labelX: depot.labelX,
        labelY: depot.labelY,
        geometry: {
          type: "Point",
          coordinates: [depot.longitude, depot.latitude]
        }
      };
    }));

    const titleCont = chart.children.push(am5.Container.new(root, {
      layout: root.verticalLayout,
      x: am5.p50,
      centerX: am5.p50,
      y: 16,
      position: "absolute"
    }));

    titleCont.children.push(am5.Label.new(root, {
      text: "Tingi Petroleum Depot Network",
      fill: yellow,
      fontSize: isCompact ? 15 : 18,
      fontWeight: "700",
      x: am5.p50,
      centerX: am5.p50
    }));

    titleCont.children.push(am5.Label.new(root, {
      text: "Midrand dispatch hub > regional supply depots",
      fill: paleYellow,
      fontSize: isCompact ? 9 : 11,
      x: am5.p50,
      centerX: am5.p50
    }));

    const zoomControl = chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
    zoomControl.homeButton.set("visible", true);

    chart.appear(1000, 100);
    setTimeout(function () {
      chart.zoomToGeoPoint({ longitude: 24.5, latitude: -29.2 }, homeZoom, true, 1000);
    }, 400);
  });
})();
