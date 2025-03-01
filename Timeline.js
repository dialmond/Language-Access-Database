<!-- 1 -->
<link title="timeline-styles" rel="stylesheet" 
      href="https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css">

<!-- 2 -->
<script src="https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js"></script>

<div id='timeline-embed' style="width: 100%; height: 600px"></div>

<!-- 3 -->
<script type="text/javascript">
    // The TL.Timeline constructor takes at least two arguments:
    // the id of the Timeline container (no '#'), and
    // the URL to your JSON data file or Google spreadsheet.
    // the id must refer to an element "above" this code,
    // and the element must have CSS styling to give it width and height
    // optionally, a third argument with configuration options can be passed.
    // See below for more about options.
    timeline = new TL.Timeline('timeline-embed',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRr0E17IGzLeGEovTfL7ohVa6FCTCfr8WLgh6ckhUj7IU-2dKdy1sKEnc13mtAY6-osR71A0J1XuXbr/pubhtml');
</script>