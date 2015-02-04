$(function () {
    //add
    $('#add-form').submit(function (e) {
        var nameVal = $('#name').val().replace(/\s+/g, '');
        var imgVal = $('#img').val().replace(/\s+/g, '');
        var urlVal = $('#url').val().replace(/\s+/g, '');
        var urlRegStr = new RegExp('^((https|http)?://).*');

        if (nameVal === '' || imgVal === '' || urlVal === '' || !urlRegStr.test(urlVal)) {
            alert('信息不完整');
            e.preventDefault();
        }
    });

    //table
    var $wrap = $('#table');
    $wrap.dataTable({
        "bPaginate": false
    });
    var lastIdx = null;
    var table = $wrap.DataTable();
    $('#table tbody')
        .on('mouseover', 'td', function () {
            var colIdx = table.cell(this).index().column;

            if (colIdx !== lastIdx) {
                $(table.cells().nodes()).removeClass('highlight');
                $(table.column(colIdx).nodes()).addClass('highlight');
            }
        })
        .on('mouseleave', function () {
            $(table.cells().nodes()).removeClass('highlight');
        });

    //grab
    $('#grab-form').submit(function (e) {
        var site = $('#site').val().replace(/\s+/g, '');
        //var start = $('#start').val().replace(/\s+/g, '');
        //var end = $('#end').val().replace(/\s+/g, '');

        if (site === '') {
            alert('信息不完整');
            e.preventDefault();
        }
    });
});