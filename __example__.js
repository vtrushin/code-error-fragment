var Value = require('basis.data').Value;
var Expression = require('basis.data.value').Expression;
var Page = require('acti:ui/page/index.js');
var profileStat = require('app.type').ProfileStat();
var OfferList = require('acti:ui/offerList/index.js');
var OfferListToolbar = require('acti:ui/offerListToolbar/index.js');
var TableHeader = require('acti:ui/offerList/module/table-head/index.js');
var offerCount = Value.from(profileStat, 'update', 'data.offersCount');
var importStatus = require('app.type').ImportStatus();
var getValidPage = require('acti:utils/paginator.js').getValidPage;
var dict = require('basis.l10n').dictionary(__filename);
var Tabs = require('./module/tabs/index.js');
var resize = require('basis.dom.resize');

function createOffersPage(config) {
	var dataSource = config.dataSource;
	var filtersComponent = config.filtersComponent;
	var predefinedFilter = config.predefinedFilter;
	var pageValue = config.pageValue;
	var setPage = config.setPage;

	var list = new OfferList({
		page: pageValue,
		dataSource: dataSource,
		getScrollContainer: function() {
			return page.tmpl.contentRef;
		}
	});

	new Expression(
		Value.query(list, 'dataSource.<static>pageCount.value'),
		pageValue,
		getValidPage
	).link(null, function(value) {
		if (value !== null) {
			setPage(value, true);
		}
	});

	var page = new Page({
		role: 'my-base',

		header: dict.token('header'),
		template: resource('./template/page.tmpl'),
		binding: {
			hasOffers: offerCount.as(Boolean),
			filters: 'satellite:',
			tabs: 'satellite:',
			list: list,
			landing: 'satellite:',
			toolbar: 'satellite:',
			tableHeader: 'satellite:',
			fixed: 'fixed',
			fixedWidth: 'fixedWidth',
			scrollLeft: 'scrollLeft'
		},
		satellite: {
			landing: {
				existsIf: offerCount.as(basis.bool.invert),
				instance: resource('app:ui/offerLanding/index.js')
			},
			filters: {
				instance: filtersComponent,
				config: {
					isShown: new Expression(
						Value.from(importStatus, 'update', 'data.inprogress'),
						predefinedFilter,
						function(inProgress, predefinedFilter) {
							return !inProgress && !predefinedFilter;
						}
					),
					offersCount: Value.from(list, 'dataSourceChanged', function(node) {
						return node.dataSource ? node.dataSource.totalCount : null;
					}).pipe('change', 'value'),
					offersState: Value.query(list, 'childNodesState')
				}
			},
			tabs: {
				instance: Tabs,
				config: {
					model: predefinedFilter
				}
			},
			toolbar: {
				instance: OfferListToolbar,
				config: {
					selectedAds: list.selection,
					totalCount: Value.query(list, 'dataSource.itemCount'),
					toggleAll: function() {
						list.toggleAll();
					}
				},
				existsIf: offerCount.as(Boolean)
			},
			tableHeader: {
				instance: TableHeader,
				existsIf: offerCount.as(Boolean)
			}
		},
		action: {
			onScroll: function() {
				this.recountFixedContentAppearance();
			}
		},
		handler: {
			ownerChanged: function() {
				if (this.owner) {
					this.recountFixedContentAppearance();
				}
			}
		},
		templateSync: function() {
			if (this.tmpl) {
				resize.remove(this.tmpl.inner, this.handleScrollableContentWidthChange, this);
			}

			Page.prototype.templateSync.call(this);

			if (this.tmpl) {
				resize.add(this.tmpl.inner, this.handleScrollableContentWidthChange, this);
			}
		},
		handleScrollableContentWidthChange: function() {
			this.fixedWidth.set(this.tmpl.inner.offsetWidth);
		},
		recountFixedContentAppearance: function() {
			var scrollableArea = this.tmpl.contentRef;
			var scrollableAreaTop = scrollableArea.getBoundingClientRect().top;

			this.scrollLeft.set(scrollableArea.scrollLeft);
			this.fixed.set(list.getToolbarTop() < scrollableAreaTop);
		},
		init: function() {
			this.fixed = new basis.Token(null);
			this.fixedWidth = new basis.Token(0);
			this.scrollLeft = new basis.Token(0);

			Page.prototype.init.apply(this, arguments);
		},
		destroy: function() {
			this.fixed.destroy();
			this.fixed = null;
			this.fixedWidth.destroy();
			this.fixedWidth = null;
			this.scrollLeft.destroy();
			this.scrollLeft = null;

			Page.prototype.destroy.apply(this, arguments);
		}
	});

	return page;
}

module.exports = {
	createOffersPage: createOffersPage
};
