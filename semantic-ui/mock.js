var mock = {
    courses: [{
        courseId: 1,
        title: '泪洒天堂',
        instructor: '艾里克·克莱普顿',
        tags: '科学',
        image: 'http://tupian.enterdesk.com/2015/gha/0800/2204/01.jpg.200.150.jpg',
        videoURL: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
        description: '80年代末，在伦敦和纽约街头墙壁上最显眼的涂鸦就是“克莱普顿（Clapton）”了。这首《泪洒天堂》是克莱普顿用他已经被悲痛碾得粉碎的心为纪念他的儿子所作。'
    }, {
        courseId: 2,
        title: 'Tears in Heaven',
        instructor: '艾里克·克莱普顿',
        image: 'http://tupian.enterdesk.com/2016/gha/02/1902/02.jpg.200.150.jpg',
        videoURL: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
        description: '80年代末，在伦敦和纽约街头墙壁上最显眼的涂鸦就是“克莱普顿（Clapton）”了。这首《泪洒天堂》是克莱普顿用他已经被悲痛碾得粉碎的心为纪念他的儿子所作。'
    }, {
        courseId: 3,
        title: 'The Mass',
        instructor: 'Era',
        image: 'http://tupian.enterdesk.com/2015/gha/12/0305/32.jpg.200.150.jpg',
        videoURL: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
        description: '“The Mass"这首歌是由一个叫“Era”的法国现代乐团创作的。《The Mass》传承了Eric Levi自首张专辑《Era》起便汲汲经营的音乐特色，匠心独具的融合流行、摇滚及古典乐，经过截枝去叶后而产生简洁有力的音乐风格。它与德国知名音乐家卡尔·奥尔夫（Carl Orff）受盛赞的作品《Carmina Burana》（布兰诗歌），曲调均源自于发现于德国的中世纪法国宗教音乐。一些人将其误传为纳粹军歌、亨德尔《弥赛亚》中的曲目。'
    }, {
        courseId: 4,
        title: '海盗湾',
        instructor: 'Pirate',
        image: 'http://tupian.enterdesk.com/2015/gha/12/1202/02.jpg.200.150.jpg',
        videoURL: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
        description: '杀毒软件公司Sophos发现了一种新木马Troj/Qhost-AC，十分的异乎寻常。它没有试图安装间谍软件或恶意程序，而只是屏蔽访问两大最受欢迎的BT网站：海盗湾（The Pirate Bay）和Mininova。该木马看起来是某一盗版软件的注册机（keygen），但运行不会产生注册码，而是修改了主机的hosts文件，将海盗湾、Suprbay（海盗湾 的论坛）和Mininova的网站重新定向到127.0.0.1，这意味着用户无法访问上述三家网站。'
    }, {
        courseId: 5,
        title: 'Victory',
        instructor: 'Two Steps From Hell',
        image: 'http://tupian.enterdesk.com/2015/gha/12/0608/02.jpg.200.150.jpg',
        videoURL: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
        description: '歌手:Two Steps From Hell。所属专辑:Battlecry。网易云音乐是一款专注于发现与分享的音乐产品,依托专业音乐人、DJ、好友推荐及社交功能,为用户打造全新的音乐生活...'
    }, {
        courseId: 6,
        title: 'Tears in Heaven',
        instructor: '艾里克·克莱普顿',
        image: 'http://tupian.enterdesk.com/2015/gha/12/0608/02.jpg.200.150.jpg',
        videoURL: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
        description: '80年代末，在伦敦和纽约街头墙壁上最显眼的涂鸦就是“克莱普顿（Clapton）”了。这首《泪洒天堂》是克莱普顿用他已经被悲痛碾得粉碎的心为纪念他的儿子所作。'
    }]
};
