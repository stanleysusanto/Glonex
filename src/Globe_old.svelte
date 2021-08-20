<script>
  import { loadModules } from "esri-loader";
  import { Collection } from "sveltefire";
  import { onMount } from "svelte";

  let location;
  let messages;
  let messagesRef;
  let message_to_send;
  let editing_message;
  let view;
  let areaTitle;

  let openedWebpageTime;

  onMount(() => {
    openedWebpageTime = new Date();
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      location = position;
    });
  }
  // Function that gets called when the element is created.
  // https://svelte.dev/tutorial/actions
  // https://svelte.school/tutorials/introduction-to-actions
  const createMap = async (domNode) => {
    // Use esri-loader to load the EsriMap and MapView modules
    // // https://github.com/Esri/esri-loader#usage
    const esriLoaderOptions = { css: true };
    const [
      EsriMap,
      SceneView,
      GraphicsLayer,
      Graphic,
      esriConfig,
      Locator,
      BaseElevationLayer,
      FeatureLayer,
      WebTileLayer,
      Polyline,
      geodesicUtils,
      Point,
      PointSymbol3D,
      ObjectSymbol3DLayer,
      LayerList,
      watchUtils,
    ] = await loadModules(
      [
        "esri/Map",
        "esri/views/SceneView",
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
        "esri/config",
        "esri/tasks/Locator",
        "esri/layers/BaseElevationLayer",
        "esri/layers/FeatureLayer",
        "esri/layers/WebTileLayer",
        "esri/geometry/Polyline",
        "esri/geometry/support/geodesicUtils",
        "esri/geometry/Point",
        "esri/symbols/PointSymbol3D",
        "esri/symbols/ObjectSymbol3DLayer",
        "esri/widgets/LayerList",
        "esri/core/watchUtils",
      ],
      esriLoaderOptions
    );

    esriConfig.apiKey =
      "AAPKfc01264404d3407ea6bf00c408424a9cq5qGex-2YuTlLmULZ02c4BQB8aJjDvlI9e3_ju3wBf-KlbXW99JOpu4dahxsS9Ge";

    let data = `ATLAS CENTAUR 2 R/B
1   694U 63047A   15309.93805426 +.00000879 +00000-0 +10245-3 0  9993
2   694 030.3578 165.2350 0591191 321.6694 034.3267 14.01313741600350
THOR AGENA D R/B
1 00733U 64002A   15309.88761686  .00000140  00000-0  69523-4 0  9997
2 00733  99.0717  95.2313 0034952  90.6226 269.8961 14.32154066697958
SL-3 R/B
1   877U 64053B   15309.93366170 +.00000101 +00000-0 +45662-4 0  9992
2   877 065.0783 213.9795 0073716 329.4390 030.2423 14.59175529715547
SL-8 R/B
1 02802U 67045B   15310.09894311  .00000172  00000-0  57532-4 0  9995
2 02802  74.0119 183.2145 0066350  18.3090 342.0432 14.43511400543970
SL-8 R/B
1 03230U 68040B   15309.62232468  .00000986  00000-0  10672-3 0  9999
2 03230  74.0364 342.6472 0029355  90.9749 269.4796 14.89493552547711
OAO 2
1 03597U 68110A   15309.78619215  .00000141  00000-0  44618-4 0  9990
2 03597  34.9940  71.4044 0005945 212.7270 147.3052 14.45682330472561
ISIS 1
1 03669U 69009A   15310.17516513  .00000076  00000-0  39697-4 0  9998
2 03669  88.4422 212.9770 1713160 143.4525 229.6738 11.29373758922472
SERT 2
1 04327U 70009A   15310.34658341  .00000002  00000-0  59765-4 0  9994
2 04327  99.2896  63.8594 0005727 104.0237 320.8080 13.58395607267546
SL-3 R/B
1 04814U 70113B   15310.51860169  .00004724  00000-0  16180-3 0  9991
2 04814  81.1470  13.0801 0027661 293.3577  66.4750 15.29624404444390
SL-3 R/B
1 05118U 71028B   15310.54485874  .00002086  00000-0  11592-3 0  9995
2 05118  81.2530 108.6824 0051051  73.5200 287.1627 15.12096859415205
ASTEX 1
1  5560U 71089A   15309.75105353 +.00000240 +00000-0 +65336-4 0  9991
2  5560 092.7197 013.8430 0015578 192.1897 167.8933 14.47710870315606
SL-8 R/B
1 05730U 71119B   15309.84003447  .00004503  00000-0  29994-3 0  9990
2 05730  73.8943  96.9825 0713866  93.6282 274.6707 13.98148811123206
COSMOS 482 DESCENT CRAFT
1 06073U 72023E   15310.52625717  .00031439  53641-5  16741-3 0  9991
2 06073  52.0616 139.6817 1681273  46.7232 326.2151 12.33405471287451
OAO 3 (COPERNICUS)
1 06153U 72065A   15310.55505875  .00000179  00000-0  43108-4 0  9992
2 06153  35.0057 152.3927 0007473 306.5552  77.9951 14.57707909294948
ATLAS CENTAUR R/B
1  6155U 72065B   15309.93068257 +.00000512 +00000-0 +84877-4 0  9991
2  6155 035.0046 300.9062 0038073 159.9455 200.2748 14.70999861284221
SL-8 R/B
1  7004U 73107B   15309.93528771 +.00016074 +00000-0 +32093-3 0  9997
2  7004 073.9414 249.2287 0234312 268.3663 089.0686 15.22344155147016
DELTA 1 R/B
1  8063U 75072B   15309.91312171 +.00084542 +56237-6 +90271-3 0  9995
2  8063 089.1181 109.3556 0378871 197.5374 161.2490 15.08447569784300
SL-8 R/B
1  8459U 75112B   15309.88799669 +.00000233 +00000-0 +88028-4 0  9990
2  8459 074.0600 113.3485 0015131 069.7231 290.5547 14.36662036089342
SL-3 R/B
1 10114U 77057B   15310.51089639  .00001630  00000-0  88716-4 0  9998
2 10114  97.2143 151.4933 0013403 210.3286 149.7174 15.15697888 94345
SEASAT 1
1 10967U 78064A   15310.52118983  .00000109  00000-0  72683-4 0  9995
2 10967 107.9992 149.8241 0002104 247.1129 112.9793 14.43460049961658
SL-14 R/B
1 11267U 79011B   15310.39836812  .00000349  00000-0  34685-4 0  9991
2 11267  82.5263  65.2846 0017744  32.2039 328.0259 14.88656698987866
SL-8 R/B
1 11574U 79089B   15309.89606839 +.00000113 +00000-0 +43827-4 0  9991
2 11574 074.0704 226.6894 0017141 280.6674 079.2551 14.40513297892099
SL-14 R/B
1 11672U 80005B   15309.95884395 +.00000362 +00000-0 +36876-4 0  9994
2 11672 082.5143 275.4443 0018353 110.9877 249.3306 14.87682280914663
SL-3 R/B
1 11849U 80051B   15310.21738264  .00045848  00000-0  36639-3 0  9999
2 11849  97.6834 238.1789 0002929 160.3653 199.7722 15.70986527945955
SL-3 R/B
1 11933U 80069B   14142.00220786  .13526183 -93797-6  14751-3 0  9999
2 11933 081.1638 015.6664 0010317 233.6206 126.8454 16.50143735859229
COSMOS 1220
1 12054U 80089A   14046.92356602  .10642788  78504-5  35630-3 0  9990
2 12054 064.9024 045.5536 0015341 327.6303 033.4497 16.43050581730424
SL-8 R/B
1 12139U 81003B   15310.48321054  .00004348  00000-0  22109-3 0  9991
2 12139  82.9476 307.6914 0490840 213.9862 142.8991 14.49698703761537
SL-8 R/B
1 12389U 81033B   15192.92184244  .24045308 -12285-5  13476-3 0  9994
2 12389 082.8246 077.2321 0005162 254.4661 106.7109 16.55182833770380
SL-3 R/B
1 12465U 81046B   15309.66625093  .00001214  00000-0  66866-4 0  9996
2 12465  81.2427 341.1298 0036806 128.0491 232.4067 15.12659092878298
METEOR PRIRODA
1 12585U 81065A   15310.49928025  .00002878  00000-0  14289-3 0  9992
2 12585  97.3646 290.5936 0013926 302.0976 172.0508 15.18405403872876
SL-3 R/B
1 12904U 81103B   15309.91346902 +.00001533 +00000-0 +10700-3 0  9994
2 12904 081.1787 228.2385 0028053 201.0673 158.9396 15.04510182403978
SL-3 R/B
1 13068U 82013B   15310.21222604  .00000704  00000-0  46177-4 0  9991
2 13068  81.2034 174.5343 0023648  99.7086 260.6810 15.06163942834811
SL-3 R/B
1 13154U 82039B   15310.11278241  .00001036  00000-0  85015-4 0  9995
2 13154  81.1842 175.2682 0041762  49.5521 310.9327 14.97695741815548
COSMOS 1400
1 13402U 82079A   14256.66778491  .27275328 -94809-6  79222-3 0  9990
2 13402 081.0858 318.9218 0010816 262.6711 226.2494 16.44432491764223
SL-3 R/B
1 13403U 82079B   15310.48846905  .00001355  00000-0  90770-4 0  9992
2 13403  81.1708 223.2720 0036136  58.3433 302.1306 15.05705355808109
SL-3 R/B
1 13819U 83010B   15310.04251196  .00003017  00000-0  16384-3 0  9998
2 13819  81.1142 126.8101 0034510 139.5943 220.7857 15.13701425784556
SL-3 R/B
1 14208U 83075B   15309.65757173  .00001584  00000-0  10128-3 0  9990
2 14208  97.3734 332.8422 0040580   5.9255 354.2446 15.09369853758543
COSMOS 1500
1 14372U 83099A   15310.47218744  .00003695  00000-0  19250-3 0  9996
2 14372  82.5180 204.6809 0015694 337.0082 109.8353 15.15603890748567
SL-8 R/B
1 14484U 83111B   15205.93052686  .08845674 -13632-5  17840-3 0  9993
2 14484 082.7984 284.0558 0021915 241.5243 119.6463 16.44974174635216
COSMOS 1536
1 14699U 84013A   15309.69049026  .00000921  00000-0  64119-4 0  9996
2 14699  82.5267 179.9834 0011339 265.3171  94.6761 15.04262267724443
COSMOS 1544
1 14819U 84027A   15310.13298913  .00005716  00000-0  24155-3 0  9999
2 14819  82.4855 258.6983 0013884 315.9103  44.1025 15.22947763726056
SL-14 R/B
1 14820U 84027B   15310.15730496  .00000245  00000-0  26912-4 0  9996
2 14820  82.5433 175.4737 0018252 199.8202 160.2306 14.83409055708636
ERBS
1 15354U 84108B   15309.88514202 +.00007689 +00000-0 +21297-3 0  9991
2 15354 057.0093 146.3810 0018210 075.5025 284.8046 15.37843337707070
SL-8 R/B
1 15483U 85006B   15310.57335019  .00000088  00000-0  39021-4 0  9998
2 15483  74.0467 355.4224 0017673 123.5107  37.9927 14.36068435612050
SL-12 R/B(2)
1 15772U 85042D   15309.95002038 +.00000104 +00000-0 +69164-4 0  9991
2 15772 071.1060 138.9531 0037471 240.9403 269.3256 14.21143164577732
SL-14 R/B
1 15945U 85069B   15309.58581972  .00000281  00000-0  30913-4 0  9996
2 15945  82.5262 325.1345 0021309  69.6566 290.6936 14.83771467633596
SL-3 R/B
1 16111U 85090B   15310.47482509  .00009393  00000-0  20516-3 0  9992
2 16111  97.3613  39.8644 0020057  10.1357 350.0292 15.44200177653169
SL-16 R/B
1 16182U 85097B   15309.91132044 -.00000228 +00000-0 -90856-4 0  9995
2 16182 071.0019 167.8433 0009949 256.0475 194.0771 14.16181756552517
SL-14 R/B
1 16496U 86006B   15310.42941950  .00000255  00000-0  27827-4 0  9992
2 16496  82.5274 200.9499 0018455 208.9101 273.6167 14.83883007610037
SL-14 R/B
1 16792U 86046B   15309.78988661  .00000265  00000-0  29449-4 0  9995
2 16792  82.4856  36.9416 0025785  74.7674  44.5990 14.82988197587526
SL-14 R/B
1 16882U 86055B   15309.90377387 +.00000327 +00000-0 +37285-4 0  9992
2 16882 082.5225 065.1423 0019830 184.3547 315.4293 14.82966575559453
EGS (AJISAI)
1 16908U 86061A   15310.23010644 -.00000097  00000-0  20332-5 0  9997
2 16908  50.0076 185.4943 0011571  35.7894  79.9367 12.44482189998100
COSMOS 1812
1 17295U 87003A   15310.47430266  .00002183  00000-0  12250-3 0  9991
2 17295  82.5175   3.6047 0003827  26.9141 333.2288 15.12869454569898
SL-14 R/B
1 17567U 87024B   15309.78363158  .00000291  00000-0  32374-4 0  9991
2 17567  82.5319  30.6153 0020487 127.7873 232.5201 14.83507366549073
COSMOS 1833
1 17589U 87027A   15309.66315533 -.00000289  00000-0 -12925-3 0  9997
2 17589  70.9152 343.5845 0015899 133.3174 226.9276 14.12846640477033
SL-16 R/B
1 17590U 87027B   15310.20441499 -.00000064  00000-0 -80627-5 0  9999
2 17590  71.0023 310.1897 0003280 144.4493 215.6850 14.16707204480706
SL-14 R/B
1 17912U 87038B   15309.87808998  .00000312  00000-0  35600-4 0  9995
2 17912  82.5034 243.2186 0020796  15.5675 344.6174 14.82785663540393
COSMOS 1844
1 17973U 87041A   15309.93320390 -.00000250  00000-0 -10539-3 0  9994
2 17973  70.8998  75.4169 0033796 288.6434  71.1019 14.14010094469849
SL-14 R/B
1 18153U 87055B   15310.08753451  .00000279  00000-0  31349-4 0  9998
2 18153  82.4980 297.5002 0020583 220.8241 139.1433 14.83030538531045
COSMOS 1867
1 18187U 87060A   15309.77381859 -.00000057  00000-0  16208-4 0  9996
2 18187  65.0107  78.3131 0019091 280.0031  79.8899 14.31065556479650
SL-14 R/B
1 18749U 88001B   15309.91279735 +.00000274 +00000-0 +30735-4 0  9992
2 18749 082.5118 137.0542 0020368 091.9663 023.1974 14.82962899482032
COSMOS 1933
1 18958U 88020A   15309.53161080 +.00000933 +00000-0 +68088-4 0  9990
2 18958 082.5278 312.5587 0013345 123.4243 236.8261 15.02486672481799
SL-3 R/B
1 19046U 88032B   15309.73159306  .00000824  00000-0  67280-4 0  9994
2 19046  97.6205 359.7531 0040265 182.5977 177.5044 15.01543733484163
SL-16 R/B
1 19120U 88039B   15310.46564642  .00000306  00000-0  16871-3 0  9993
2 19120  71.0128 128.8204 0021653   4.8369 355.2961 14.19125431422860
COSMOS 1953
1 19210U 88050A   15309.90173940 +.00001903 +00000-0 +13446-3 0  9999
2 19210 082.5190 244.3249 0015338 106.2708 254.0207 15.04263452468080
SL-8 R/B
1 19257U 88053B   15309.96599912 +.00000127 +00000-0 +51413-4 0  9994
2 19257 074.0501 219.6828 0021671 257.1920 178.6039 14.37254850433836
COSMOS 1975
1 19573U 88093A   15309.78276464 +.00001706 +00000-0 +12411-3 0  9991
2 19573 082.5228 195.3562 0015568 139.5770 220.6615 15.03119363450094
SL-14 R/B
1 19574U 88093B   15310.16748021  .00000263  00000-0  29296-4 0  9996
2 19574  82.5313 335.7153 0020182 257.4022 165.6197 14.83071371462149
SL-16 R/B
1 19650U 88102B   15310.09669261  .00000255  00000-0  15422-3 0  9998
2 19650  70.9986 173.7577 0014432 350.2854   9.7987 14.15729780392615
INTERCOSMOS 24
1 20261U 89080A   15309.76793199 +.00000214 +00000-0 +58151-4 0  9996
2 20261 082.5959 031.7245 1205905 015.8800 347.6857 12.55632933192390
SL-14 R/B
1 20262U 89080C   15309.84845071 +.00000387 +00000-0 +11057-3 0  9997
2 20262 082.5938 073.5041 1238076 160.0247 205.4104 12.48745450188582
DELTA 1 R/B
1 20323U 89089B   15310.14675427  .00000190  00000-0  58236-4 0  9998
2 20323  97.0762 340.1387 0073172 133.4063 227.3256 14.48045791369478
DELTA 2 R/B(1)
1 20453U 90008B   15310.46995193  .00003426  00000-0  20369-3 0  9995
2 20453  35.6267  82.6126 0301203 320.8672  37.0606 14.80146968360825
COSMOS 2058
1 20465U 90010A   15309.90189565 +.00001495 +00000-0 +12805-3 0  9996
2 20465 082.4887 094.1841 0017147 116.6839 243.6141 14.96777393376055
SL-14 R/B
1 20466U 90010B   15310.37912933  .00000251  00000-0  29082-4 0  9998
2 20466  82.5055 203.4771 0022041 110.7045 249.6534 14.81144758390330
SL-14 R/B
1 20511U 90018B   15309.92865220 +.00000219 +00000-0 +25977-4 0  9995
2 20511 082.5211 142.8214 0016185 243.2036 231.6934 14.79805829363815
HST
1 20580U 90037B   15310.23973575  .00001847  00000-0  10627-3 0  9994
2 20580  28.4707 297.1173 0002691 324.9145 147.4713 15.07845401201264
SL-16 R/B
1 20625U 90046B   15310.38327323  .00005147  00000-0  26802-2 0  9992
2 20625  71.0060 304.8804 0022367 274.4064  85.4985 14.14882652314564
COSMOS 2084
1 20663U 90055A   15310.21703562  .00000688  00000-0  81987-4 0  9991
2 20663  62.7954  32.7849 0099244  29.3266 331.3346 14.90789901371979
SL-6 R/B(2)
1 20666U 90055D   15310.42535366  .00000906  00000-0  97808-4 0  9994
2 20666  62.7847 312.6435 0117897  50.6275 310.5190 14.91176841373350
SL-8 R/B
1 20775U 90078B   15310.14937461  .00007109  00000-0  36768-3 0  9990
2 20775  82.9318 169.5904 0608179 351.7735 114.9850 14.25906237264661
SL-8 R/B
1 21088U 91006B   15309.93684260 +.00000137 +00000-0 +12287-3 0  9995
2 21088 082.9402 098.2658 0022961 166.7354 307.7221 13.77012597244235
OKEAN 3
1 21397U 91039A   15309.64945841  .00001002  00000-0  96399-4 0  9996
2 21397  82.5216 338.1991 0019379  51.8358 308.4604 14.91863067321861
COSMOS 2151
1 21422U 91042A   15309.89269456 +.00000914 +00000-0 +88913-4 0  9991
2 21422 082.5001 087.0716 0015851 101.0710 259.2293 14.91377723299576
SL-14 R/B
1 21423U 91042B   15309.70595696  .00000201  00000-0  23671-4 0  9999
2 21423  82.4925 152.2468 0018315  25.6641 334.5476 14.79561015315419
ERS 1
1 21574U 91050A   15310.49805469  .00000359  00000-0  13365-3 0  9997
2 21574  98.3850 258.5867 0031923 275.1197 194.6714 14.37392755273016
ARIANE 40 R/B
1 21610U 91050F   15310.17886791  .00000141  00000-0  58487-4 0  9994
2 21610  98.6885 349.3721 0002133 254.2550 146.7079 14.40666068275309
INTERCOSMOS 25
1 21819U 91086A   15309.84041913 +.00001360 +00000-0 +26924-3 0  9999
2 21819 082.5619 057.2578 1526648 260.3606 082.2345 12.03839207041322
SL-14 R/B
1 21820U 91086B   15309.88777121 +.00000399 +00000-0 +72329-4 0  9994
2 21820 082.5572 106.0462 1579192 065.7516 310.0210 11.93038489036504
SL-8 R/B
1 21876U 92008B   15309.86901668 +.00000030 +00000-0 +15804-4 0  9990
2 21876 082.9289 195.1808 0033555 238.5448 170.2125 13.75570884190131
SL-8 R/B
1 21938U 92020B   15309.89614692 +.00000103 +00000-0 +91540-4 0  9996
2 21938 082.9299 077.9550 0029891 038.5655 075.7829 13.75230525181997
SL-16 R/B
1 22220U 92076B   15309.91085553 -.00000241  00000-0 -97430-4 0  9992
2 22220  71.0010 219.6056 0010470  90.7837 337.1178 14.16380799187334
SL-16 R/B
1 22285U 92093B   15310.50702680 -.00000152  00000-0 -53888-4 0  9996
2 22285  71.0226   7.1677 0006337 291.9375  68.1073 14.14977816179260
COSMOS 2228
1 22286U 92094A   15310.37556034  .00000845  00000-0  91045-4 0  9997
2 22286  82.5237 209.0769 0019201 276.8269  83.0763 14.87181621234965
SL-16 R/B
1 22566U 93016B   15310.16901054  .00000157  00000-0  10606-3 0  9995
2 22566  71.0078 223.2699 0012046 302.7558  57.2403 14.14910041167956
COSMOS 2242
1 22626U 93024A   15310.19429857  .00000890  00000-0  96030-4 0  9990
2 22626  82.5238 236.9052 0017591 276.6961  83.2254 14.87195835218595
SL-16 R/B
1 22803U 93059B   15310.23744666  .00000114  00000-0  81074-4 0  9999
2 22803  70.9919  50.4478 0018263 209.5142 150.4952 14.16726211144863
ARIANE 40 R/B
1 22830U 93061H   15309.94639624 +.00000073 +00000-0 +45044-4 0  9996
2 22830 098.8759 300.8418 0010379 203.6775 208.8854 14.31377941153696
COSMOS 2278
1 23087U 94023A   15309.96344596 +.00000135 +00000-0 +96246-4 0  9992
2 23087 071.0530 150.4278 0008158 020.1711 081.1537 14.13699811110975`;

    // geodesic lines and antipodes will be added to this graphics layer
    // var analysisGraphicsLayer2D = new GraphicsLayer();
    var analysisGraphicsLayer3D = new GraphicsLayer();

    var lineSymbol3D = {
      type: "line-3d",
      symbolLayers: [
        {
          type: "path",
          profile: "circle",
          material: {
            color: "#ff0000",
          },
          width: 6000, // the width in m
          height: 6000, // the height in m
          profileRotation: "all",
        },
      ],
    };

    var pointSymbol3D = new PointSymbol3D({
      symbolLayers: [
        new ObjectSymbol3DLayer({
          width: 10000,
          height: 30000,
          resource: {
            primitive: "cone",
          },
          material: {
            color: "#ff0000",
          },
        }),
      ],
    });
    // Create the map
    // con

    // // Create the mapView from the map
    // const view = new MapView({
    //   container: domNode,
    //   map: map,
    //   zoom: 8,
    //   center: [-90, 38], // longitude, latitude
    // });

    // helper function that returns an instance of the Black Marble WebTileLayer
    // (it'll be reused by both the 3D ground terrain layer and the 2D layer draped on top)
    function createEarthAtNightWebTileLayer() {
      var earthAtNightWebTileLayer = new WebTileLayer({
        urlTemplate:
          "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/{level}/{row}/{col}.png",
        copyright:
          'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
      });

      // only tile zoom levels 1 through 8 exist on the server resource,
      // thus we remove levels 0 and 9+ from the tileInfo.lods array to block attempts at fetching those tiles
      earthAtNightWebTileLayer.tileInfo.lods.splice(0, 1);
      earthAtNightWebTileLayer.tileInfo.lods.splice(8);

      return earthAtNightWebTileLayer;
    }

    // this is the custom 3D ground terrain elevation layer class
    // internally, it also relies on the Black Marble WebTileLayer to calculate elevation values
    var EarthAtNight3DLayerClass = BaseElevationLayer.createSubclass({
      properties: {
        // add on custom properties
        exaggerationFactor: 85000,
      },
      load: function () {
        this._earthAtNightLayer = createEarthAtNightWebTileLayer();

        var internalLayerResourcePromise = this._earthAtNightLayer.load().then(
          function () {
            // set the elevation layer's tileInfo to be equal to
            // the underlying WebTileLayer's own modified tileInfo
            this.tileInfo = this._earthAtNightLayer.tileInfo;
          }.bind(this)
        );

        // add a promise that has to be resolved before the elevation layer is considered loaded
        this.addResolvingPromise(internalLayerResourcePromise);
      },
      fetchTile: function (level, row, col, options) {
        // fetch image tiles from the Black Marble WebTileLayer,
        // convert each pixel's "luminance" into elevation values,
        // and return a promise that resolves to an object with the properties defined in ElevationTileData
        return this._earthAtNightLayer.fetchTile(level, row, col, options).then(
          function (imageElement) {
            var width = imageElement.width;
            var height = imageElement.height;

            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(imageElement, 0, 0, width, height);

            var imageData = ctx.getImageData(0, 0, width, height).data;

            var elevations = [];

            for (var index = 0; index < imageData.length; index += 4) {
              var r = imageData[index];
              var g = imageData[index + 1];
              var b = imageData[index + 2];
              // opacity would be imageData[index + 3] but we don't need it

              // convert the RGB pixel color to a "luminance" from 0-1
              const luminance = Math.round(
                (r * 299 + g * 587 + b * 114) / 1000 / 255
              );

              // apply the terrain exaggeration factor to arrive at an elevation value
              // e.g. 0.75 luminance becomes a height of 63,750 meters
              var elevation = luminance * this.exaggerationFactor;

              // add the individual height value to the elevations array
              elevations.push(elevation);
            }

            // the promise returned in the elevation layer's "fetchTile" method
            // must resolve to an ElevationTileData object
            return {
              values: elevations,
              width: width,
              height: height,
              noDataValue: -1,
            };
          }.bind(this)
        );
      },
    });

    // create layer instances and then create SceneView, Map, widgets, etc.
    // - earthAtNight3DLayer
    // - earthAtNight2DLayer
    // - citiesLayer

    // this instance of the Black Marble WebTileLayer will be an operational layer that will be draped over the SceneView's custom ground terrain
    var earthAtNight2DLayer = createEarthAtNightWebTileLayer();

    // this instance of the custom 3D ground terrain elevation layer will be provided to the SceneView's ground layers property
    var earthAtNight3DLayer = new EarthAtNight3DLayerClass();

    // this cities feature layer provides the labeled callouts
    var citiesLayer = new FeatureLayer({
      url:
        "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Cities/FeatureServer/0",
      elevationInfo: {
        mode: "relative-to-ground",
      },
      returnZ: false,
      minScale: 25000000,
      definitionExpression: "POP_RANK <= 6 OR STATUS LIKE '%National%'",
      outFields: ["CITY_NAME"],
      screenSizePerspectiveEnabled: true,
      featureReduction: {
        type: "selection",
      },
      renderer: {
        type: "simple",
        symbol: {
          // hide any kind of symbol showing up on the ground for the feature
          // because we're only intersted in the label with a callout
          type: "point-3d",
          symbolLayers: [
            {
              type: "icon",
              size: 0,
            },
          ],
        },
      },
      labelingInfo: [
        {
          labelPlacement: "above-center",
          labelExpressionInfo: {
            expression: "$feature.CITY_NAME",
          },
          symbol: {
            type: "label-3d",
            symbolLayers: [
              {
                type: "text",
                material: {
                  color: "black",
                },
                halo: {
                  color: [255, 255, 255, 0.75],
                  size: 1.75,
                },
                size: 10,
              },
            ],
            verticalOffset: {
              screenLength: 10000,
              maxWorldLength: 50000,
              minWorldLength: 1000,
            },
            callout: {
              type: "line",
              size: 2,
              color: [255, 255, 255, 0.75],
            },
          },
        },
      ],
    });

    let map = new EsriMap({
      ground: {
        layers: [earthAtNight3DLayer],
        surfaceColor: "black",
      },
      basemap: {
        baseLayers: [earthAtNight2DLayer],
        title: "Nighttime Lights",
        id: "nighttime",
        thumbnailUrl:
          "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/7/54/75.png",
      },
      layers: [analysisGraphicsLayer3D],
    });

    view = new SceneView({
      container: domNode,
      map: map,
      camera: {
        position: {
          longitude: 36.68,
          latitude: 24.44,
          z: 650000,
        },
        heading: 320,
        tilt: 55,
      },
      environment: {
        atmosphere: {
          quality: "high",
        },
      },
      constraints: {
        altitude: {
          max: 12000000000, // meters
        },
      },
      // force the popup to the docked position
      // for each selected feature
      popup: {
        dockEnabled: true,
        dockOptions: {
          breakpoint: false,
        },
      },
    });

    // const layerList = new LayerList({
    //   view: view,
    // });
    // view.ui.add(layerList, "bottom-right");

    // function fadeVisibilityOn(layer) {
    //   let animating = true;
    //   let opacity = 0;
    //   // fade layer's opacity from 0 to
    //   // whichever value the user has configured
    //   const finalOpacity = layer.opacity;
    //   layer.opacity = opacity;

    //   view.whenLayerView(layer).then(function (layerView) {
    //     function incrementOpacityByFrame() {
    //       if (opacity >= finalOpacity && animating) {
    //         animating = false;
    //         return;
    //       }

    //       layer.opacity = opacity;
    //       opacity += 0.05;

    //       requestAnimationFrame(incrementOpacityByFrame);
    //     }

    //     // Wait for tiles to finish loading before beginning the fade
    //     watchUtils.whenFalseOnce(layerView, "updating", function (updating) {
    //       requestAnimationFrame(incrementOpacityByFrame);
    //     });
    //   });
    // }

    // view.when().then(function () {
    //   // When the user toggles a layer on, transition
    //   // the layer's visibility using opacity
    //   layerList.operationalItems.forEach(function (item) {
    //     item.watch("visible", function (visible) {
    //       if (visible) {
    //         fadeVisibilityOn(item.layer);
    //       }
    //     });
    //   });
    // });

    var clickedMapPoint = null;
    function handleViewClick(evt) {
      // wrap geometries around the Earth if there is a clicked point
      // set the (shared) clickedMapPoint variable value for other functions
      if (!evt.mapPoint) {
        return;
      }
      clickedMapPoint = evt.mapPoint;
      wrapAround(clickedMapPoint);
    }

    function wrapAround(clickedMapPoint, latitudeShift) {
      // create a simple line at the clicked point and wrap it around the Earth
      var wrapAroundLine = new Polyline({
        paths: [
          [
            [location.coords.longitude, location.coords.latitude],
            [clickedMapPoint.longitude, clickedMapPoint.latitude],
          ],
        ],
        spatialReference: {
          wkid: 4326,
        },
      });

      // geodetically densify the simple wrap-around line
      var maxSegmentLength = 250000;

      // console.log(wrapAroundLine);

      var geodesicLine = geodesicUtils.geodesicDensify(
        wrapAroundLine,
        maxSegmentLength
      );

      // console.log(geodesicLine);

      let maxHeight = 5000000;

      for (i = 0; i < geodesicLine.paths[0].length; i++) {
        if (i < geodesicLine.paths[0].length / 2) {
          geodesicLine.paths[0][i].push(
            maxHeight * (i / (geodesicLine.paths[0].length - 1))
          );
        } else {
          geodesicLine.paths[0][i].push(
            maxHeight *
              ((geodesicLine.paths[0].length - 1 - i) /
                (geodesicLine.paths[0].length - 1))
          );
        }
      }
      geodesicLine.hasZ = true;
      geodesicLine.paths[0].push([
        clickedMapPoint.longitude,
        clickedMapPoint.latitude,
        0,
      ]);
      // console.log(geodesicLine);

      // render the geodesic line and the antipodes in the view
      handleGeodesicDensify(geodesicLine, wrapAroundLine, clickedMapPoint);

      // // show the results text (once)
      // if (antipodeInfoNode.style.opacity !== "1") {
      //   // with css transition this will fade in
      //   antipodeInfoNode.style.display = "block";
      //   setTimeout(function () {
      //     antipodeInfoNode.style.opacity = "1";
      //   }, 300);
      // }
    }

    function handleGeodesicDensify(
      geodesicLine,
      wrapAroundLine,
      clickedMapPoint
    ) {
      // analysisGraphicsLayer2D.removeAll();
      analysisGraphicsLayer3D.removeAll();

      // analysisGraphicsLayer2D.add(
      //   new Graphic({
      //     geometry: geodesicLine,
      //     symbol: lineSymbol2D,
      //   })
      // );

      analysisGraphicsLayer3D.add(
        new Graphic({
          geometry: new Point(
            clickedMapPoint.longitude,
            clickedMapPoint.latitude,
            0
          ),
          symbol: pointSymbol3D,
        })
      );
      analysisGraphicsLayer3D.add(
        new Graphic({
          geometry: geodesicLine,
          symbol: lineSymbol3D,
        })
      );

      wrapAroundLine.paths[0].forEach(function (vertex, idx) {
        if (idx === 0 || idx === 2) {
          // analysisGraphicsLayer2D.add(
          //   new Graphic({
          //     geometry: new Point(vertex[0], vertex[1]),
          //     symbol: pointSymbol2D,
          //   })
          // );

          analysisGraphicsLayer3D.add(
            new Graphic({
              geometry: new Point(vertex[0], vertex[1], 0),
              symbol: pointSymbol3D,
            })
          );
        }
      });
    }

    // var view = new SceneView({
    //   container: domNode,
    //   map: map,
    //   constraints: {
    //     altitude: {
    //       max: 12000000000, // meters
    //     },
    //   },
    //   // force the popup to the docked position
    //   // for each selected feature
    //   popup: {
    //     dockEnabled: true,
    //     dockOptions: {
    //       breakpoint: false,
    //     },
    //   },
    // });

    // Use the watch functionality of the JavaScript API (view.watch) to call a
    // function every time the extent changes. Every time it does, update the
    // "centerText" variable - Svelte takes care of updating the UI based
    // on this variable assignment
    // (Reactivity!) https://svelte.dev/tutorial/reactive-assignments

    // Create a locator task using the world geocoding service
    var locatorTask = new Locator({
      url:
        "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer",
    });

    view.popup.watch("selectedFeature", function () {
      satelliteTracks.removeAll();
    });

    view.popup.on("trigger-action", function (event) {
      if (event.action.id === "track") {
        var graphic = view.popup.selectedFeature;
        var trackFeatures = [];

        for (var i = 0; i < 60 * 24; i++) {
          var loc = null;
          try {
            loc = getSatelliteLocation(
              new Date(graphic.attributes.time + i * 1000 * 60),
              graphic.attributes.line1,
              graphic.attributes.line2
            );
          } catch (error) {}

          if (loc !== null) {
            trackFeatures.push([loc.x, loc.y, loc.z]);
          }
        }

        var track = new Graphic({
          geometry: {
            type: "polyline", // autocasts as new Polyline()
            paths: [trackFeatures],
          },
          symbol: {
            type: "line-3d", // autocasts as new LineSymbol3D()
            symbolLayers: [
              {
                type: "line", // autocasts as new LineSymbol3DLayer()
                material: {
                  color: [192, 192, 192, 0.5],
                },
                size: 3,
              },
            ],
          },
        });

        satelliteTracks.add(track);
      }
    });

    var satelliteLayer = new GraphicsLayer();
    var satelliteTracks = new GraphicsLayer();

    map.addMany([satelliteLayer, satelliteTracks]);

    // Parse the satellite TLE data
    var lines = data.split("\n");
    var count = (lines.length / 9).toFixed(0);

    function moveSatellites() {
      // console.log(satelliteLayer);
      // console.log(satelliteLayer.graphics);
      // console.log(satelliteLayer.graphics._items);
      // console.log(satelliteLayer.graphics.items);
      // console.log(satelliteLayer.graphics._items[0]);
      // console.log(satelliteLayer.graphics.items[0]);
      // console.log(openedWebpageTime);
      for (i = 0; i < satelliteLayer.graphics._items.length; i++) {
        // console.log(satelliteLayer.graphics._items[i].geometry);
        // a = new Date();
        //satelliteLayer.graphics._items[i].attributes.time +
        // a -
        //       openedWebpageTime
        // satelliteLayer.graphics._items[i].geometry = getSatelliteLocation(
        //   new Date(),
        //   satelliteLayer.graphics._items[i].attributes.line1,
        //   satelliteLayer.graphics._items[i].attributes.line2
        // );
        // console.log(satelliteLayer.graphics._items[i].geometry);
        satelliteLayer.graphics._items[i].geometry = {
          type: "point",
          x:
            satelliteLayer.graphics._items[i].geometry.x +
            satelliteLayer.graphics._items[i].attributes.heading.x,
          y:
            satelliteLayer.graphics._items[i].geometry.y +
            satelliteLayer.graphics._items[i].attributes.heading.y,
          z: satelliteLayer.graphics._items[i].geometry.z,
        };
      }

      requestAnimationFrame(moveSatellites);
    }

    for (var i = 0; i < count; i++) {
      var commonName = lines[i * 3 + 0];
      var line1 = lines[i * 3 + 1];
      var line2 = lines[i * 3 + 2];
      var time = Date.now();

      /*************************************************
       * Create attributes for the International
       * designator and Norad identifier. See the
       * doc for details.
       * https://www.space-track.org/documentation#/tle
       *************************************************/

      var designator = line1.substring(9, 16);
      var launchYear = designator.substring(0, 2);
      launchYear =
        Number(launchYear) >= 57 ? "19" + launchYear : "20" + launchYear;
      var launchNum = Number(designator.substring(2, 5)).toString();
      var noradId = Number(line1.substring(3, 7));
      var satelliteLoc = null;

      try {
        satelliteLoc = getSatelliteLocation(new Date(time), line1, line2);
      } catch (error) {}

      if (satelliteLoc !== null) {
        var template = {
          // autocasts as new PopupTemplate()
          title: "{name}",
          content: "Launch number {number} of {year}",
          actions: [
            {
              // Create a popup action to display the satellite track.
              title: "Show Satellite Track",
              id: "track",
              className: "esri-icon-globe",
            },
          ],
        };

        var graphic = new Graphic({
          geometry: satelliteLoc,
          symbol: {
            type: "picture-marker", // autocasts as new PictureMarkerSymbol()
            url:
              "https://gitcdn.link/repo/Kimeiga/f1c3864bb833e3042b9be034a31b1225/raw/31a4860955126f779cce3d7e2bf77c7c4ca7307f/flier.svg",
            width: 20,
            height: 20,
          },
          attributes: {
            name: commonName,
            year: launchYear,
            id: noradId,
            number: launchNum,
            time: time,
            line1: line1,
            line2: line2,
            heading: {
              x: Math.random(),
              y: Math.random(),
            },
          },
          popupTemplate: template,
        });

        satelliteLayer.add(graphic);
      }
    }

    function getSatelliteLocation(date, line1, line2) {
      /****************************************************
       * satellite-js is a library that includes a set of
       * functions to convert TLE to geographic locations
       * We use this to get the geographic location of the
       * satellites for the current date. For more details
       * on satellite-js visib the github repo
       * https://github.com/shashwatak/satellite-js
       ****************************************************/
      var satrec = satellite.twoline2satrec(line1, line2);
      var position_and_velocity = satellite.propagate(
        satrec,
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      );
      var position_eci = position_and_velocity.position;

      var gmst = satellite.gstime_from_date(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      );

      var position_gd = satellite.eci_to_geodetic(position_eci, gmst);

      var longitude = position_gd.longitude;
      var latitude = position_gd.latitude;
      var height = position_gd.height;
      if (isNaN(longitude) || isNaN(latitude) || isNaN(height)) {
        return null;
      }
      var rad2deg = 180 / Math.PI;
      while (longitude < -Math.PI) {
        longitude += 2 * Math.PI;
      }
      while (longitude > Math.PI) {
        longitude -= 2 * Math.PI;
      }
      return {
        type: "point", // Autocasts as new Point()
        x: rad2deg * longitude,
        y: rad2deg * latitude,
        z: height * 1000,
      };
    }

    // sceneView.on('click', handleViewClick);

    /*
     * Pinpointing coordinate on globe (tracking lon & lat and placing marker at location; later, will be location to send message/read news)
     * Currently displays address (without street) upon click (along with coordinates) but no "pinpoint" or marker yet – address is more key to news API
     */

    view.on("click", function (evt) {
      handleViewClick(evt);
      const params = {
        location: evt.mapPoint,
      };

      locatorTask.locationToAddress(params).then(
        function (response) {
          // Show the address found
          const address = response.address;
          showAddress(response, evt.mapPoint);
        },
        function (err) {
          // Show no address found
          showAddress("No address found.", evt.mapPoint);
        }
      );
    });
    requestAnimationFrame(moveSatellites);
    // Defines an action to zoom out from the selected feature
    var sendMessageAction = {
      // This text is displayed as a tooltip
      title: "Send Message",
      // The ID by which to reference the action in the event handler
      id: "send-message",
      // Sets the icon font used to style the action button
      className: "esri-icon-contact",
    };
    // Adds the custom action to the popup.
    view.popup.actions.push(sendMessageAction);

    // The function to execute when the zoom-out action is clicked
    function showMessage() {
      // in this case the view zooms out two LODs on each click
      // messagesRef.add({
      //   from: {
      //     longitude: location.coords.longitude,
      //     latitude: location.coords.latitude,
      //   },
      //   to: {
      //     longitude: view.center.longitude,
      //     latitude: view.center.latitude,
      //   },
      //   message: "hello yall",
      // });

      editing_message = true;
    }

    // This event fires for each click on any action
    view.popup.on("trigger-action", function (event) {
      // If the zoom-out action is clicked, fire the zoomOut() function
      if (event.action.id === "send-message") {
        showMessage();
      }
    });

    function showAddress(response, pt) {
      let title_info = "Address: ";
      for (var i in response.attributes) {
        if (response.attributes.hasOwnProperty(i)) {
          title_info += ` ${i} ${response.attributes[i]} `;
        }
      }
      let title;
      if (response.attributes["City"]) {
        title =
          response.attributes["City"] +
          ", " +
          response.attributes["Region"] +
          ", " +
          response.attributes["CountryCode"];
      } else if (response.attributes["Region"]) {
        title =
          response.attributes["Region"] +
          ", " +
          response.attributes["CountryCode"];
      } else {
        title = response.attributes["CountryCode"];
      }

      areaTitle = title;

      view.popup.open({
        title: title,
        content:
          "Coordinates: " +
          Math.round(pt.longitude * 100000) / 100000 +
          ", " +
          Math.round(pt.latitude * 100000) / 100000,
        location: pt,
      });
    }
  };

  function sendMessage() {
    var d = new Date();
    d = new Date(d.getTime() + 10000);

    messagesRef.add({
      from: {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      },
      to: {
        longitude: view.center.longitude,
        latitude: view.center.latitude,
      },
      message: message_to_send,
      createdAt: new Date(),
      landAt: d,
    });
    message_to_send = "";
    editing_message = false;
  }

  // requestAnimationFrame(movePlanes);

  // function movePlanes() {
  //   requestAnimationFrame(movePlanes);
  // }
</script>

<!-- use:createMap calls the "createMap" function (defined above) when the  -->
<!-- element is created. -->
<!-- See the "createMap" function def above for more info. -->
<div class="view" use:createMap />
<Collection
  path={"messages"}
  on:data={(e) => (messages = e.detail.data)}
  on:ref={(e) => (messagesRef = e.detail.ref)}
/>

{#if editing_message}
  <div class="modal">
    <h4 style="color: white;">Send a message to {areaTitle}</h4>
    <textarea bind:value={message_to_send} />
    <button on:click={sendMessage}>Send</button>
    <button on:click={() => (editing_message = false)}>Cancel</button>
  </div>
{/if}

<!-- See the "createMap" function def above for more info. -->
<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 99;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .view {
    height: 100vh;
    width: 100vw;
  }
</style>
