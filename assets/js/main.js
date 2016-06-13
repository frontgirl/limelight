$(function() {

	var App = (function(){

			return {
				init : function() {
					HeaderCollapse.init();
				}
			}
		})()

	/**
	 * Dummy Module Example
	 */
		,HeaderCollapse = (function(){
			var $collapserBtn = $('#nav-collapser'),
				$header = $('#header-top');
			return {
				init : function() {
					$collapserBtn.on('click',function(){
						$header.toggleClass('nav-open');
					})
				}
			}
		})()

		;App.init();

});

