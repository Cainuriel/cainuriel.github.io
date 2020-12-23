$(document).ready(function () {
    "use strict";

    var colors = [
        {
            id: ".neo-demo-color-1",
            base_0: "#151812",
            base_1: "#ffffff",
            color_1: "#e90041",
            color_2: "#ce083d",
        },
        {
            id: ".neo-demo-color-2",
            base_0: "#151515",
            base_1: "#f1f1f1",
            color_1: "#DE0D92",
            color_2: "#C90080",
        },
        {
            id: ".neo-demo-color-3",
            base_0: "#222222",
            base_1: "#E1E2E2",
            color_1: "#EC407A",
            color_2: "",
        },
        {
            id: ".neo-demo-color-4",
            base_0: "#1D2228",
            base_1: "#ffffff",
            color_1: "#ff5e14",
            color_2: "",
        },
        {
            id: ".neo-demo-color-5",
            base_0: "#373A36",
            base_1: "#ffffff",
            color_1: "tomato",
            color_2: "",
        },
        {
            id: ".neo-demo-color-6",
            base_0: "#272933",
            base_1: "#ffffff",
            color_1: "#ffa000",
            color_2: "",
        },
        {
            id: ".neo-demo-color-7",
            base_0: "#212121",
            base_1: "#fff",
            color_1: "#0b7554",
            color_2: "",
        },
        {
            id: ".neo-demo-color-8",
            base_0: "#000",
            base_1: "#fff",
            color_1: "#00b7b8",
            color_2: "",
        },
        {
            id: ".neo-demo-color-9",
            base_0: "#000",
            base_1: "#fff",
            color_1: "#00BCD4",
            color_2: "",
        },
        {
            id: ".neo-demo-color-10",
            base_0: "#0A0A0A",
            base_1: "#FFFFFF",
            color_1: "#1D32F2",
            color_2: "",
        },
        {
            id: ".neo-demo-color-11",
            base_0: "#121212",
            base_1: "#E6E2DD",
            color_1: "#845EC2",
            color_2: "",
        },
        {
            id: ".neo-demo-color-12",
            base_0: "#0e262b",
            base_1: "#ffffff",
            color_1: "#7b1f29",
            color_2: "darkred",
        },
      
    ];

        
    $(".neo-demo .neo-demo-close").on("click", function () {
        $(".neo-demo").removeClass("active");
    });
    $(".neo-demo .neo-demo-toggle").on("click", function () {
        $(".neo-demo").toggleClass("active");
    });

    colors.map( color => {
        $(color.id).on("click", function() {
            document.documentElement.style.setProperty("--base-0", color.base_0);
            document.documentElement.style.setProperty("--base-1", color.base_1);
            document.documentElement.style.setProperty("--primary", color.color_1);
            document.documentElement.style.setProperty("--primary-1", color.color_2);
        })
    } )
});