/*
* @Author: Marte
* @Date:   2016-05-23 21:44:03
* @Last Modified by:   Marte
* @Last Modified time: 2016-05-25 10:39:28
*/

$(document).ready(function() {
    $('#course_id').attr('src', courseIdImage);
    $('#course_name').load(function() {
        positionCourseName();
    }).attr('src', courseNameImage);

    $.each(simpleChapters, function(i, chapter) {
        var $ul = $('#slide-box ul.simpleTemplate').clone().removeClass('simpleTemplate');
        $ul.children('a').text(chapter.name).attr('data-title', chapter.title).attr('data-url', chapter.url).attr('data-id', chapter.id).data('duration',chapter.duration);
        $ul.appendTo('#slide-box');
    });

    $.each(chapters, function(i, chapter) {
        var $ul = $('#slide-box ul.template').clone().removeClass('template');
        var $liTemplate = $ul.children('li').remove().hide();
        $ul.children('a').text(chapter.name);

        $.each(chapter.sections, function(j, section) {
            var $li = $liTemplate.clone();
            $li.find('a').text(section.name).attr('data-title', section.title).attr('data-url', section.url).attr('data-id', chapter.id);
            $li.appendTo($ul);
        });
        $ul.appendTo('#slide-box');
    });

    $('#slide-box ul').find('li:eq(0)').css('paddingTop','0');
    // 点击 ul>a 展开点击的 ul，并隐藏其他 ul下的 li
    $('#slide-box').on('click', '#slide-box ul>a', function(e) {
        e.preventDefault();
        $(this).parent().siblings().find('li').slideUp('fast');
        $(this).parent().find('li').slideDown('fast');
        // 修改添加样式
        $('#slide-box ul>a').removeClass('expand').addClass('collapse');
        $(this).removeClass('collapse').addClass('expand');
        if ($(this).attr('data-url')) {
            loadPage($(this));
        }
    });

    $('#slide-box').on('click', '#slide-box li>a',function(e) {
        e.preventDefault();
        loadPage($(this));
        $('#slide-box li>a').removeClass('active');
        $(this).addClass('active');
    });

    // TODO: 加载链接的资源
    function loadPage($a) {
        var url = $a.attr('data-url');
        var title = $a.attr('data-title');
        $('#title span').text(title);
        $('#content').attr('src',url);
		clearInterval(rte_client.interval);
		rte_client.setLastAccess($a.attr('data-id'));
		rte_client.interval=setInterval(function(){
			rte_client.setValue($a.attr('data-id'),'score',100);
			clearInterval(rte_client.interval);
		},$a.data('duration')*1000);
    }

    changeH();

    $(window).resize(function(){
        changeH();
    });

    function changeH(){
        var mainWidth = $(window).width() - 100;
        var contentHeight = $(window).height() - $('.header').outerHeight() - $('.footer').outerHeight() - 35;
		var justify = 0;

        $('.header').width(mainWidth);
        $('.main').width(mainWidth);

        $('.side-bar').height(contentHeight - justify);
        $('.content').width(mainWidth - $('.side-bar').outerWidth() - 10).height(contentHeight - justify);

        $('#slide-box').height(contentHeight - 30 - justify);
        $('.article').height(contentHeight - 30 -  justify);


        $('.con').css('width', $(window).width() - 100);
        $('.con_r').css('width', $('.con').width() - $('#slide-box').width() - 10);
        // $('.con_r').outerWidth($('.con').width() - $('#slide-box').width() - 10);

        positionCourseName();
    }

    function positionCourseName() {
        $img = $('#course_name');
        $img.css({
            'left': ($('.header').width() - $img.width()) / 2 + 'px',
            'top':  ($('.header').height() - $img.height()) / 2 + 'px'
        });
    }
});
