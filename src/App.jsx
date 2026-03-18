import { useState, useEffect } from "react";

const TRIGRAMS = [
  { name: "乾", symbol: "☰", lines: [1,1,1], meaning: "天" },
  { name: "兑", symbol: "☱", lines: [1,1,0], meaning: "泽" },
  { name: "离", symbol: "☲", lines: [1,0,1], meaning: "火" },
  { name: "震", symbol: "☳", lines: [0,1,1], meaning: "雷" },
  { name: "巽", symbol: "☴", lines: [1,0,0], meaning: "风" },
  { name: "坎", symbol: "☵", lines: [0,1,0], meaning: "水" },
  { name: "艮", symbol: "☶", lines: [0,0,1], meaning: "山" },
  { name: "坤", symbol: "☷", lines: [0,0,0], meaning: "地" },
];

const HEXAGRAMS = {
  "乾乾":{ num:1, name:"乾为天", desc:"元亨利贞", yaoci:["初九：潜龙勿用","九二：见龙在田，利见大人","九三：君子终日乾乾，夕惕若厉，无咎","九四：或跃在渊，无咎","九五：飞龙在天，利见大人","上九：亢龙有悔"] },
  "坤坤":{ num:2, name:"坤为地", desc:"元亨，利牝马之贞", yaoci:["初六：履霜，坚冰至","六二：直方大，不习，无不利","六三：含章可贞，或从王事，无成有终","六四：括囊，无咎无誉","六五：黄裳，元吉","上六：龙战于野，其血玄黄"] },
  "震坎":{ num:3, name:"水雷屯", desc:"元亨利贞，勿用有攸往", yaoci:["初九：磐桓，利居贞，利建侯","六二：屯如邅如，乘马班如","六三：即鹿无虞，惟入于林中","六四：乘马班如，求婚媾，往吉","九五：屯其膏，小贞吉，大贞凶","上六：乘马班如，泣血涟如"] },
  "坎艮":{ num:4, name:"山水蒙", desc:"亨，匪我求童蒙", yaoci:["初六：发蒙，利用刑人","九二：包蒙吉，纳妇吉","六三：勿用取女，见金夫","六四：困蒙，吝","六五：童蒙，吉","上九：击蒙，不利为寇，利御寇"] },
  "乾坎":{ num:5, name:"水天需", desc:"有孚，光亨，贞吉", yaoci:["初九：需于郊，利用恒，无咎","九二：需于沙，小有言，终吉","九三：需于泥，致寇至","六四：需于血，出自穴","九五：需于酒食，贞吉","上六：入于穴，有不速之客三人来"] },
  "坎乾":{ num:6, name:"天水讼", desc:"有孚，窒惕，中吉，终凶", yaoci:["初六：不永所事，小有言，终吉","九二：不克讼，归而逋","六三：食旧德，贞厉，终吉","九四：不克讼，复即命，渝安贞，吉","九五：讼，元吉","上九：或锡之鞶带，终朝三褫之"] },
  "坤坎":{ num:7, name:"水地师", desc:"贞，大人吉，无咎", yaoci:["初六：师出以律，否臧凶","九二：在师中，吉无咎","六三：师或舆尸，凶","六四：师左次，无咎","六五：田有禽，利执言，无咎","上六：大君有命，开国承家，小人勿用"] },
  "坎坤":{ num:8, name:"地水比", desc:"吉，原筮，元永贞，无咎", yaoci:["初六：有孚比之，无咎","六二：比之自内，贞吉","六三：比之匪人","六四：外比之，贞吉","九五：显比，王用三驱","上六：比之无首，凶"] },
  "乾巽":{ num:9, name:"风天小畜", desc:"亨，密云不雨", yaoci:["初九：复自道，何其咎，吉","九二：牵复，吉","九三：舆说辐，夫妻反目","六四：有孚，血去惕出，无咎","九五：有孚挛如，富以其邻","上九：既雨既处，尚德载，妇贞厉"] },
  "兑乾":{ num:10, name:"天泽履", desc:"履虎尾，不咥人，亨", yaoci:["初九：素履，往无咎","九二：履道坦坦，幽人贞吉","六三：眇能视，跛能履，履虎尾，咥人，凶","九四：履虎尾，愬愬终吉","九五：夬履，贞厉","上九：视履考祥，其旋元吉"] },
  "乾坤":{ num:11, name:"地天泰", desc:"小往大来，吉亨", yaoci:["初九：拔茅茹，以其汇，征吉","九二：包荒，用冯河，不遐遗","九三：无平不陂，无往不复","六四：翩翩，不富以其邻","六五：帝乙归妹，以祉元吉","上六：城复于隍，勿用师"] },
  "坤乾":{ num:12, name:"天地否", desc:"否之匪人，不利君子贞", yaoci:["初六：拔茅茹，以其汇，贞吉亨","六二：包承，小人吉，大人否亨","六三：包羞","九四：有命无咎，畴离祉","九五：休否，大人吉","上九：倾否，先否后喜"] },
  "离乾":{ num:13, name:"天火同人", desc:"同人于野，亨", yaoci:["初九：同人于门，无咎","六二：同人于宗，吝","九三：伏戎于莽，升其高陵","九四：乘其墉，弗克攻，吉","九五：同人先号咷而后笑","上九：同人于郊，无悔"] },
  "乾离":{ num:14, name:"火天大有", desc:"元亨", yaoci:["初九：无交害，匪咎，艰则无咎","九二：大车以载，有攸往，无咎","九三：公用亨于天子，小人弗克","九四：匪其彭，无咎","六五：厥孚交如，威如，吉","上九：自天祐之，吉无不利"] },
  "艮坤":{ num:15, name:"地山谦", desc:"亨，君子有终", yaoci:["初六：谦谦君子，用涉大川，吉","六二：鸣谦，贞吉","九三：劳谦君子，有终，吉","六四：无不利，撝谦","六五：不富以其邻，利用侵伐","上六：鸣谦，利用行师，征邑国"] },
  "震坤":{ num:16, name:"雷地豫", desc:"利建侯行师", yaoci:["初六：鸣豫，凶","六二：介于石，不终日，贞吉","六三：盱豫悔，迟有悔","九四：由豫，大有得","六五：贞疾，恒不死","上六：冥豫，成有渝，无咎"] },
  "兑震":{ num:17, name:"泽雷随", desc:"元亨利贞，无咎", yaoci:["初九：官有渝，贞吉，出门交有功","六二：系小子，失丈夫","六三：系丈夫，失小子","九四：随有获，贞凶","九五：孚于嘉，吉","上六：拘系之，乃从维之"] },
  "巽艮":{ num:18, name:"山风蛊", desc:"元亨，利涉大川", yaoci:["初六：干父之蛊，有子，考无咎","九二：干母之蛊，不可贞","九三：干父之蛊，小有悔，无大咎","六四：裕父之蛊，往见吝","六五：干父之蛊，用誉","上九：不事王侯，高尚其事"] },
  "兑坤":{ num:19, name:"地泽临", desc:"元亨利贞，至于八月有凶", yaoci:["初九：咸临，贞吉","九二：咸临，吉无不利","六三：甘临，无攸利","六四：至临，无咎","六五：知临，大君之宜，吉","上六：敦临，吉无咎"] },
  "巽坤":{ num:20, name:"风地观", desc:"盥而不荐，有孚颙若", yaoci:["初六：童观，小人无咎，君子吝","六二：窥观，利女贞","六三：观我生，进退","六四：观国之光，利用宾于王","九五：观我生，君子无咎","上九：观其生，君子无咎"] },
  "离震":{ num:21, name:"火雷噬嗑", desc:"亨，利用狱", yaoci:["初九：屦校灭趾，无咎","六二：噬肤灭鼻，无咎","六三：噬腊肉，遇毒","九四：噬干胏，得金矢，利艰贞，吉","六五：噬干肉，得黄金，贞厉，无咎","上九：何校灭耳，凶"] },
  "艮离":{ num:22, name:"山火贲", desc:"亨，小利有攸往", yaoci:["初九：贲其趾，舍车而徒","六二：贲其须","九三：贲如濡如，永贞吉","六四：贲如皤如，白马翰如","六五：贲于丘园，束帛戋戋","上九：白贲，无咎"] },
  "艮坤":{ num:23, name:"山地剥", desc:"不利有攸往", yaoci:["初六：剥床以足，蔑贞凶","六二：剥床以辨，蔑贞凶","六三：剥之，无咎","六四：剥床以肤，凶","六五：贯鱼，以宫人宠，无不利","上九：硕果不食，君子得舆，小人剥庐"] },
  "震坤":{ num:24, name:"地雷复", desc:"亨，出入无疾", yaoci:["初九：不远复，无祗悔，元吉","六二：休复，吉","六三：频复，厉无咎","六四：中行独复","六五：敦复，无悔","上六：迷复，凶，有灾眚"] },
  "乾震":{ num:25, name:"天雷无妄", desc:"元亨利贞", yaoci:["初九：无妄，往吉","六二：不耕获，不菑畲，则利有攸往","六三：无妄之灾，或系之牛","九四：可贞，无咎","九五：无妄之疾，勿药有喜","上九：无妄，行有眚，无攸利"] },
  "乾艮":{ num:26, name:"山天大畜", desc:"利贞，不家食吉", yaoci:["初九：有厉，利已","九二：舆说輹","九三：良马逐，利艰贞","六四：童牛之牿，元吉","六五：豮豕之牙，吉","上九：何天之衢，亨"] },
  "震艮":{ num:27, name:"山雷颐", desc:"贞吉，观颐，自求口实", yaoci:["初九：舍尔灵龟，观我朵颐，凶","六二：颠颐，拂经于丘颐，征凶","六三：拂颐，贞凶","六四：颠颐，吉","六五：拂经，居贞吉，不可涉大川","上九：由颐，厉吉，利涉大川"] },
  "巽兑":{ num:28, name:"泽风大过", desc:"栋桡，利有攸往，亨", yaoci:["初六：藉用白茅，无咎","九二：枯杨生稊，老夫得其女妻，无不利","九三：栋桡，凶","九四：栋隆，吉","九五：枯杨生华，老妇得其士夫，无咎无誉","上六：过涉灭顶，凶，无咎"] },
  "坎坎":{ num:29, name:"坎为水", desc:"有孚，维心亨，行有尚", yaoci:["初六：习坎，入于坎窞，凶","九二：坎有险，求小得","六三：来之坎坎，险且枕，入于坎窞，勿用","六四：樽酒簋贰，用缶，纳约自牖，终无咎","九五：坎不盈，祗既平，无咎","上六：系用徽纆，置于丛棘"] },
  "离离":{ num:30, name:"离为火", desc:"利贞，亨，畜牝牛，吉", yaoci:["初九：履错然，敬之，无咎","六二：黄离，元吉","九三：日昃之离，不鼓缶而歌","九四：突如其来如，焚如，死如，弃如","六五：出涕沱若，戚嗟若，吉","上九：王用出征，有嘉折首，获匪其丑，无咎"] },
  "艮兑":{ num:31, name:"泽山咸", desc:"亨，利贞，取女吉", yaoci:["初六：咸其拇","六二：咸其腓，凶，居吉","九三：咸其股，执其随，往吝","九四：贞吉悔亡，憧憧往来，朋从尔思","九五：咸其脢，无悔","上六：咸其辅颊舌"] },
  "巽震":{ num:32, name:"雷风恒", desc:"亨，无咎，利贞", yaoci:["初六：浚恒，贞凶，无攸利","九二：悔亡","九三：不恒其德，或承之羞，贞吝","九四：田无禽","六五：恒其德，贞，妇人吉，夫子凶","上六：振恒，凶"] },
  "艮乾":{ num:33, name:"天山遁", desc:"亨，小利贞", yaoci:["初六：遁尾，厉，勿用有攸往","六二：执之用黄牛之革，莫之胜说","九三：系遁，有疾厉，畜臣妾吉","九四：好遁，君子吉，小人否","九五：嘉遁，贞吉","上九：肥遁，无不利"] },
  "震乾":{ num:34, name:"雷天大壮", desc:"利贞", yaoci:["初九：壮于趾，征凶，有孚","九二：贞吉","九三：小人用壮，君子用罔","九四：贞吉，悔亡","六五：丧羊于易，无悔","上六：羝羊触藩，不能退，不能遂"] },
  "离坤":{ num:35, name:"火地晋", desc:"康侯用锡马蕃庶", yaoci:["初六：晋如摧如，贞吉","六二：晋如愁如，贞吉","六三：众允，悔亡","九四：晋如鼫鼠，贞厉","六五：悔亡，失得勿恤，往吉无不利","上九：晋其角，维用伐邑，厉吉无咎"] },
  "坤离":{ num:36, name:"地火明夷", desc:"利艰贞", yaoci:["初九：明夷于飞，垂其翼","六二：明夷，夷于左股","九三：明夷于南狩，得其大首，不可疾贞","六四：入于左腹，获明夷之心，出于门庭","六五：箕子之明夷，利贞","上六：不明晦，初登于天，后入于地"] },
  "离巽":{ num:37, name:"风火家人", desc:"利女贞", yaoci:["初九：闲有家，悔亡","六二：无攸遂，在中馈，贞吉","九三：家人嗃嗃，悔厉，吉","六四：富家，大吉","九五：王假有家，勿恤，吉","上九：有孚威如，终吉"] },
  "兑离":{ num:38, name:"火泽睽", desc:"小事吉", yaoci:["初九：悔亡，丧马勿逐，自复","九二：遇主于巷，无咎","六三：见舆曳，其牛掣，其人天且劓","九四：睽孤，遇元夫，交孚，厉无咎","六五：悔亡，厥宗噬肤，往何咎","上九：睽孤，见豕负涂"] },
  "坎艮":{ num:39, name:"水山蹇", desc:"利西南，不利东北", yaoci:["初六：往蹇，来誉","六二：王臣蹇蹇，匪躬之故","九三：往蹇，来反","六四：往蹇，来连","九五：大蹇，朋来","上六：往蹇，来硕，吉"] },
  "震坎":{ num:40, name:"雷水解", desc:"利西南，无所往", yaoci:["初六：无咎","九二：田获三狐，得黄矢，贞吉","六三：负且乘，致寇至，贞吝","九四：解而拇，朋至斯孚","六五：君子维有解，吉，有孚于小人","上六：公用射隼于高墉之上，获之，无不利"] },
  "兑艮":{ num:41, name:"山泽损", desc:"有孚，元吉，无咎", yaoci:["初九：已事遄往，无咎，酌损之","九二：利贞，征凶，弗损益之","六三：三人行，则损一人","六四：损其疾，使遄有喜，无咎","六五：或益之十朋之龟，弗克违，元吉","上九：弗损益之，无咎，贞吉"] },
  "巽震":{ num:42, name:"风雷益", desc:"利有攸往，利涉大川", yaoci:["初九：利用为大作，元吉，无咎","六二：或益之十朋之龟，弗克违，永贞吉","六三：益之用凶事，无咎","六四：中行告公从，利用为依迁国","九五：有孚惠心，勿问元吉","上九：莫益之，或击之，立心勿恒，凶"] },
  "乾兑":{ num:43, name:"泽天夬", desc:"扬于王庭，孚号，有厉", yaoci:["初九：壮于前趾，往不胜，为咎","九二：惕号，莫夜有戎，勿恤","九三：壮于頄，有凶","九四：臀无肤，其行次且","九五：苋陆夬夬，中行无咎","上六：无号，终有凶"] },
  "乾巽":{ num:44, name:"天风姤", desc:"女壮，勿用取女", yaoci:["初六：系于金柅，贞吉","九二：包有鱼，无咎，不利宾","九三：臀无肤，其行次且，厉，无大咎","九四：包无鱼，起凶","九五：以杞包瓜，含章，有陨自天","上九：姤其角，吝，无咎"] },
  "兑坤":{ num:45, name:"泽地萃", desc:"亨，王假有庙", yaoci:["初六：有孚不终，乃乱乃萃","六二：引吉，无咎，孚乃利用禴","六三：萃如嗟如，无攸利","九四：大吉，无咎","九五：萃有位，无咎","上六：赍咨涕洟，无咎"] },
  "坤巽":{ num:46, name:"地风升", desc:"元亨，用见大人", yaoci:["初六：允升，大吉","九二：孚乃利用禴，无咎","九三：升虚邑","六四：王用亨于岐山，吉无咎","六五：贞吉，升阶","上六：冥升，利于不息之贞"] },
  "坎兑":{ num:47, name:"泽水困", desc:"亨，贞，大人吉，无咎", yaoci:["初六：臀困于株木，入于幽谷","九二：困于酒食，朱绂方来","六三：困于石，据于蒺藜","九四：来徐徐，困于金车，吝，有终","九五：劓刖，困于赤绂","上六：困于葛藟，于臲卼，曰动悔"] },
  "巽坎":{ num:48, name:"水风井", desc:"改邑不改井，无丧无得", yaoci:["初六：井泥不食，旧井无禽","九二：井谷射鲋，瓮敝漏","九三：井渫不食，为我心恻","六四：井甃，无咎","九五：井洌寒泉食","上六：井收勿幕，有孚元吉"] },
  "离兑":{ num:49, name:"泽火革", desc:"己日乃孚，元亨利贞", yaoci:["初九：巩用黄牛之革","六二：己日乃革之，征吉，无咎","九三：征凶，贞厉，革言三就，有孚","九四：悔亡，有孚改命，吉","九五：大人虎变，未占有孚","上六：君子豹变，小人革面"] },
  "离巽":{ num:50, name:"火风鼎", desc:"元吉，亨", yaoci:["初六：鼎颠趾，利出否","九二：鼎有实，我仇有疾，不我能即，吉","九三：鼎耳革，其行塞","九四：鼎折足，覆公餗，其形渥，凶","六五：鼎黄耳金铉，利贞","上九：鼎玉铉，大吉，无不利"] },
  "震震":{ num:51, name:"震为雷", desc:"亨，震来虩虩", yaoci:["初九：震来虩虩，后笑言哑哑，吉","六二：震来厉，亿丧贝","六三：震苏苏，震行无眚","九四：震遂泥","六五：震往来厉，亿无丧，有事","上六：震索索，视矍矍，征凶"] },
  "艮艮":{ num:52, name:"艮为山", desc:"艮其背，不获其身", yaoci:["初六：艮其趾，无咎，利永贞","六二：艮其腓，不拯其随，其心不快","九三：艮其限，列其夤，厉熏心","六四：艮其身，无咎","六五：艮其辅，言有序，悔亡","上九：敦艮，吉"] },
  "巽艮":{ num:53, name:"风山渐", desc:"女归吉，利贞", yaoci:["初六：鸿渐于干，小子厉，有言，无咎","六二：鸿渐于磐，饮食衎衎，吉","九三：鸿渐于陆，夫征不复","六四：鸿渐于木，或得其桷，无咎","九五：鸿渐于陵，妇三岁不孕，终莫之胜，吉","上九：鸿渐于逵，其羽可用为仪，吉"] },
  "兑震":{ num:54, name:"雷泽归妹", desc:"征凶，无攸利", yaoci:["初九：归妹以娣，跛能履，征吉","九二：眇能视，利幽人之贞","六三：归妹以须，反归以娣","九四：归妹愆期，迟归有时","六五：帝乙归妹，其君之袂，不如其娣之袂良","上六：女承筐无实，士刲羊无血，无攸利"] },
  "离震":{ num:55, name:"雷火丰", desc:"亨，王假之", yaoci:["初九：遇其配主，虽旬无咎，往有尚","六二：丰其蔀，日中见斗","九三：丰其沛，日中见沫","九四：丰其蔀，日中见斗","六五：来章，有庆誉，吉","上六：丰其屋，蔀其家，窥其户，阒其无人，三岁不觌，凶"] },
  "艮离":{ num:56, name:"火山旅", desc:"小亨，旅贞吉", yaoci:["初六：旅琐琐，斯其所取灾","六二：旅即次，怀其资，得童仆贞","九三：旅焚其次，丧其童仆，贞厉","九四：旅于处，得其资斧，我心不快","六五：射雉一矢亡，终以誉命","上九：鸟焚其巢，旅人先笑后号咷"] },
  "巽巽":{ num:57, name:"巽为风", desc:"小亨，利有攸往", yaoci:["初六：进退，利武人之贞","九二：巽在床下，用史巫纷若，吉无咎","九三：频巽，吝","六四：悔亡，田获三品","九五：贞吉，悔亡，无不利","上九：巽在床下，丧其资斧，贞凶"] },
  "兑兑":{ num:58, name:"兑为泽", desc:"亨，利贞", yaoci:["初九：和兑，吉","九二：孚兑，吉，悔亡","六三：来兑，凶","九四：商兑未宁，介疾有喜","九五：孚于剥，有厉","上六：引兑"] },
  "坎巽":{ num:59, name:"风水涣", desc:"亨，王假有庙", yaoci:["初六：用拯马壮，吉","九二：涣奔其机，悔亡","六三：涣其躬，无悔","六四：涣其群，元吉","九五：涣汗其大号，涣王居，无咎","上九：涣其血，去逖出，无咎"] },
  "兑坎":{ num:60, name:"水泽节", desc:"亨，苦节不可贞", yaoci:["初九：不出户庭，无咎","九二：不出门庭，凶","六三：不节若，则嗟若，无咎","六四：安节，亨","九五：甘节，吉，往有尚","上六：苦节，贞凶，悔亡"] },
  "兑巽":{ num:61, name:"风泽中孚", desc:"豚鱼吉，利涉大川", yaoci:["初九：虞吉，有他不燕","九二：鸣鹤在阴，其子和之","六三：得敌，或鼓或罢，或泣或歌","六四：月几望，马匹亡，无咎","九五：有孚挛如，无咎","上九：翰音登于天，贞凶"] },
  "艮震":{ num:62, name:"雷山小过", desc:"亨，利贞", yaoci:["初六：鸟以凶","六二：过其祖，遇其妣","九三：弗过防之，从或戕之，凶","九四：无咎，弗过遇之","六五：密云不雨，自我西郊，公弋取彼在穴","上六：弗遇过之，飞鸟离之，凶"] },
  "离坎":{ num:63, name:"水火既济", desc:"亨，小利贞，初吉终乱", yaoci:["初九：曳其轮，濡其尾，无咎","六二：妇丧其茀，勿逐，七日得","九三：高宗伐鬼方，三年克之","六四：繻有衣袽，终日戒","九五：东邻杀牛，不如西邻之禴祭","上六：濡其首，厉"] },
  "坎离":{ num:64, name:"火水未济", desc:"亨，小狐汔济", yaoci:["初六：濡其尾，吝","九二：曳其轮，贞吉","六三：未济，征凶，利涉大川","九四：贞吉，悔亡，震用伐鬼方","六五：贞吉，无悔，君子之光，有孚，吉","上九：有孚于饮酒，无咎，濡其首，有孚失是"] },
};

function getTrigramByLines(lines) {
  return TRIGRAMS.find(t => t.lines.every((v,i) => v === lines[i]));
}

function LineDraw({ line, animate, small }) {
  const w = small ? 40 : 64, h = small ? 4 : 6, g = small ? 4 : 6;
  return (
    <div style={{ display:"flex", gap:g, justifyContent:"center", margin:`${small?2:4}px 0`,
      opacity:animate?1:0, transition:"opacity 0.5s" }}>
      {line===1
        ? <div style={{width:w, height:h, background:"#1a1a1a", borderRadius:3}}/>
        : <><div style={{width:w/2-2, height:h, background:"#1a1a1a", borderRadius:3}}/>
            <div style={{width:w/2-2, height:h, background:"#1a1a1a", borderRadius:3}}/></>}
    </div>
  );
}

function HistoryPanel({ history, onSelect, onClose }) {
  return (
    <div style={{position:"fixed",top:0,right:0,width:320,height:"100vh",background:"#fff",
      boxShadow:"-2px 0 16px rgba(0,0,0,0.08)",zIndex:100,display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"20px 20px 16px",borderBottom:"1px solid #f0f0f0"}}>
        <span style={{fontSize:15,letterSpacing:3,color:"#1a1a1a"}}>占卜记录</span>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#999"}}>×</button>
      </div>
      {history.length === 0
        ? <div style={{textAlign:"center",color:"#bbb",fontSize:13,padding:40,letterSpacing:2}}>尚无记录</div>
        : history.map((h,i) => (
          <div key={i} onClick={()=>onSelect(h)}
            style={{padding:"16px 20px",borderBottom:"1px solid #f7f7f7",cursor:"pointer",
              transition:"background 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="#fafafa"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontSize:18}}>{h.upper.symbol}{h.lower.symbol}</span>
              <div>
                <div style={{fontSize:13,color:"#1a1a1a",letterSpacing:1}}>{h.name}</div>
                <div style={{fontSize:11,color:"#bbb"}}>{h.date}</div>
              </div>
            </div>
            <div style={{fontSize:12,color:"#888",letterSpacing:1,
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {h.question}
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default function App() {
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState("input");
  const [lines, setLines] = useState([]);
  const [visibleLines, setVisibleLines] = useState([]);
  const [hexagram, setHexagram] = useState(null);
  const [interpretation, setInterpretation] = useState("");
  const [loading, setLoading] = useState(false);
  const [castCount, setCastCount] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [showYaoci] = useState(true);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("iching_history") || "[]");
      setHistory(saved);
    } catch {}
  }, []);

  const saveHistory = (entry) => {
    try {
      const updated = [entry, ...history].slice(0, 30);
      setHistory(updated);
      localStorage.setItem("iching_history", JSON.stringify(updated));
    } catch {}
  };

  const handleStart = () => {
    if (!question.trim()) return;
    setPhase("casting"); setLines([]); setVisibleLines([]);
    setCastCount(0); setHexagram(null); setInterpretation("");
  };

  const handleCast = () => {
    if (castCount >= 6 || shaking) return;
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      const newLine = Math.random() < 0.5 ? 1 : 0;
      const newLines = [...lines, newLine];
      setLines(newLines); setCastCount(c => c+1);
      setTimeout(() => setVisibleLines(v => [...v, true]), 100);
      if (newLines.length === 6) {
        const lower = getTrigramByLines(newLines.slice(0,3));
        const upper = getTrigramByLines(newLines.slice(3,6));
        const key = lower.name + upper.name;
        const hex = HEXAGRAMS[key] || {num:"?", name:upper.meaning+lower.meaning+"卦", desc:"变化无穷，静观其变", yaoci:[]};
        setHexagram({...hex, lower, upper});
        setTimeout(() => fetchInterpretation(hex, lower, upper), 600);
      }
    }, 500);
  };

  const fetchInterpretation = async (hex, lower, upper) => {
    setLoading(true); setPhase("result");
    try {
      const prompt = "你是一位精通周易的古代占卜师，以古典文言风格解卦。\n用户问题：「" + question + "」\n所得卦象：第" + hex.num + "卦 " + hex.name + "（上" + upper.meaning + "下" + lower.meaning + "）\n卦辞：" + hex.desc + "\n\n请以神秘古典的文言文风格，针对用户的具体问题给出解读，约150字。要有意境，有指引，忌白话。";
     const res = await fetch("/api/chat", {
                method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user", content:prompt}] })
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==="text")?.text || "天机不可泄露，静待时机。";
      setInterpretation(text);
      saveHistory({ question, name:hex.name, num:hex.num, lower, upper,
        desc:hex.desc, yaoci:hex.yaoci, interpretation:text,
        lines: [...lines, ...(lines.length<6?[Math.random()<0.5?1:0]:[])],
        date: new Date().toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}) });
    } catch { setInterpretation("天机不可泄露，静待时机。"); }
    setLoading(false);
  };

  const loadFromHistory = (h) => {
    setQuestion(h.question);
    setHexagram({ num:h.num, name:h.name, lower:h.lower, upper:h.upper, desc:h.desc, yaoci:h.yaoci });
    setInterpretation(h.interpretation);
    setLines(h.lines || []);
    setVisibleLines(Array(6).fill(true));
    setPhase("result"); setShowHistory(false);
  };

  const reset = () => {
    setPhase("input"); setQuestion(""); setLines([]); setVisibleLines([]);
    setHexagram(null); setInterpretation(""); setCastCount(0); setShowYaoci(false);
  };

  return (
    <div style={{minHeight:"100vh", background:"#fafaf8", fontFamily:"'Georgia',serif",
      display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 20px",
      position:"relative"}}>

      {/* Header */}
      <div style={{textAlign:"center", marginBottom:40, width:"100%", maxWidth:520}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
          <div style={{width:40}}/>
          <div>
            <div style={{fontSize:11,letterSpacing:6,color:"#bbb",marginBottom:6}}>THE BOOK OF ANSWERS</div>
            <h1 style={{fontSize:28,fontWeight:400,color:"#1a1a1a",margin:0,letterSpacing:4}}>周易答案之书</h1>
          </div>
          <button onClick={()=>setShowHistory(s=>!s)}
            style={{background:"none",border:"1px solid #e8e8e8",borderRadius:6,
              padding:"6px 10px",cursor:"pointer",fontSize:12,color:"#999",letterSpacing:1}}>
            记录
          </button>
        </div>
        <div style={{width:40,height:1,background:"#ddd",margin:"0 auto"}}/>
      </div>

      {/* Input */}
      {phase==="input" && (
        <div style={{width:"100%",maxWidth:480,textAlign:"center"}}>
          <p style={{color:"#aaa",fontSize:13,letterSpacing:2,marginBottom:28}}>心存一问，诚意占之</p>
          <textarea value={question} onChange={e=>setQuestion(e.target.value)}
            placeholder="请将心中所问，以文字述之……"
            style={{width:"100%",minHeight:100,padding:"16px",border:"1px solid #e8e8e8",
              borderRadius:8,fontSize:15,resize:"none",outline:"none",color:"#1a1a1a",
              background:"#fff",letterSpacing:1,lineHeight:1.8,boxSizing:"border-box",fontFamily:"inherit"}}/>
          <button onClick={handleStart}
            style={{marginTop:20,padding:"12px 48px",background:"#1a1a1a",color:"#fff",
              border:"none",borderRadius:6,fontSize:13,letterSpacing:4,cursor:"pointer"}}>
            起　卦
          </button>
        </div>
      )}

      {/* Casting */}
      {phase==="casting" && (
        <div style={{width:"100%",maxWidth:480,textAlign:"center"}}>
          <div style={{color:"#888",fontSize:13,letterSpacing:1,marginBottom:4}}>{question}</div>
          <div style={{width:32,height:1,background:"#eee",margin:"10px auto 28px"}}/>
          <div style={{minHeight:110,marginBottom:28,display:"flex",flexDirection:"column-reverse",
            justifyContent:"center",alignItems:"center"}}>
            {lines.map((line,i)=><LineDraw key={i} line={line} animate={visibleLines[i]}/>)}
            {lines.length===0&&<div style={{color:"#ddd",fontSize:12,letterSpacing:2}}>爻象将显于此</div>}
          </div>
          <div style={{marginBottom:14,color:"#bbb",fontSize:12}}>第 {castCount+1} 爻 / 共六爻</div>
          {castCount<6
            ? <button onClick={handleCast}
                style={{padding:"13px 52px",background:shaking?"#444":"#1a1a1a",color:"#fff",
                  border:"none",borderRadius:6,fontSize:13,letterSpacing:4,cursor:"pointer",
                  transform:shaking?"rotate(-2deg) scale(0.97)":"none",transition:"all 0.1s"}}>
                {shaking?"摇　卦…":"投　掷（第"+(castCount+1)+"次）"}
              </button>
            : <div style={{color:"#bbb",fontSize:12,letterSpacing:2}}>六爻已成，正在解卦…</div>}
        </div>
      )}

      {/* Result */}
      {phase==="result" && hexagram && (
        <div style={{width:"100%",maxWidth:520,textAlign:"center"}}>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,letterSpacing:4,color:"#bbb",marginBottom:6}}>第 {hexagram.num} 卦</div>
            <div style={{fontSize:26,letterSpacing:6,color:"#1a1a1a",fontWeight:400}}>{hexagram.name}</div>
            <div style={{fontSize:12,color:"#aaa",marginTop:6,letterSpacing:2}}>
              上{hexagram.upper.meaning}（{hexagram.upper.symbol}）下{hexagram.lower.meaning}（{hexagram.lower.symbol}）
            </div>
          </div>

          {/* Lines display */}
          <div style={{display:"flex",flexDirection:"column-reverse",alignItems:"center",
            margin:"16px 0",padding:"18px",background:"#fff",borderRadius:8,border:"1px solid #f0f0f0"}}>
            {lines.map((line,i)=><LineDraw key={i} line={line} animate={true}/>)}
          </div>

          {/* Gua Ci + Yaoci */}
          <div style={{fontSize:13,color:"#999",letterSpacing:2,marginBottom:20,fontStyle:"italic"}}>
            <div>卦辞：{hexagram.desc}</div>
            {hexagram.yaoci && hexagram.yaoci.map((y,i)=>(
              <div key={i} style={{marginTop:6}}>{y}</div>
            ))}
          </div>

          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <div style={{flex:1,height:1,background:"#f0f0f0"}}/>
            <div style={{fontSize:11,color:"#ccc",letterSpacing:2}}>解　卦</div>
            <div style={{flex:1,height:1,background:"#f0f0f0"}}/>
          </div>

          <div style={{background:"#fff",border:"1px solid #f0f0f0",borderRadius:8,
            padding:"22px",textAlign:"left",minHeight:100}}>
            {loading
              ? <div style={{textAlign:"center",color:"#ccc",letterSpacing:3,fontSize:13,padding:"20px 0"}}>
                  ⟳ 占卜师正在解卦…
                </div>
              : <p style={{color:"#333",fontSize:15,lineHeight:2.1,letterSpacing:1,margin:0}}>
                  {interpretation}
                </p>}
          </div>

          <div style={{marginTop:16,fontSize:12,color:"#ccc",letterSpacing:1}}>所问：{question}</div>
          <button onClick={reset}
            style={{marginTop:28,padding:"10px 40px",background:"transparent",color:"#aaa",
              border:"1px solid #e8e8e8",borderRadius:6,fontSize:12,letterSpacing:4,cursor:"pointer"}}>
            再　占
          </button>
        </div>
      )}

      {/* History panel */}
      {showHistory && (
        <>
          <div onClick={()=>setShowHistory(false)}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.2)",zIndex:99}}/>
          <HistoryPanel history={history} onSelect={loadFromHistory} onClose={()=>setShowHistory(false)}/>
        </>
      )}
    </div>
  );
}