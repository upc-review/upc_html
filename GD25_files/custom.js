document.addEventListener('DOMContentLoaded', function () {
	const filterForm = document.getElementById('filter-form');
	if (filterForm) {
		filterForm.addEventListener('submit', function(e) {
		e.preventDefault();
		const form = e.target;
		const data = new FormData(form);
		const params = new URLSearchParams(data);

		fetch(`${window.location.pathname}?${params.toString()}`, {
			headers: { 'X-Requested-With': 'XMLHttpRequest' },
			credentials: 'same-origin'
		})
		.then(response => {
			if (!response.ok) throw new Error(gettext('Error fetching guidelines'));
			return response.text();
		})
		.then(html => {
			document.getElementById('guideline-results').innerHTML = html;
		})
		.catch(error => console.error(error));
		});
	}
	const groupSelect = document.querySelector('select[name="group"]');
	if (groupSelect) {
		const subgroupSelect = document.querySelector('select[name="subgroup"]');
		groupSelect.addEventListener('change', function () {
		const groupId = this.value;
		subgroupSelect.innerHTML = '<option value="">' + gettext("All Subgroups") + '</option>';
		if (!groupId) return;
    	fetch(`${window.location.pathname}/ajax/get-subgroups/?group_id=${groupId}`)
		.then(response => response.json())
		.then(data => {
			if (data.subgroups) {
			data.subgroups.forEach(function (subgroup) {
				const option = document.createElement('option');
				option.value = subgroup.id;
				option.textContent = subgroup.name;
        option.textContent += ` (${subgroup.guideline_count})`;
				subgroupSelect.appendChild(option);
			});
			}
		})
		.catch(error => {
			console.error(gettext('Error fetching subgroups:'), error);
		});
	});
}
	const designspaceSelect = document.querySelector('select[name="designspace"]');
	let designspaceId = null;
	let dimensionId = null;
	const dimensionSelect = document.querySelector('select[name="designspace_dimension"]');
	const categorySelect = document.querySelector('select[name="designspace_category"]');
	const url = new URL(
    	`${window.location.pathname}ajax/get-designspace-structure/`,
    		window.location.origin
  	);
	
	if (designspaceSelect && dimensionSelect && categorySelect) {
		designspaceSelect.addEventListener('change', function () {
		designspaceId =
  				designspaceSelect.options[designspaceSelect.selectedIndex].value;
		// Reset selects
		dimensionSelect.innerHTML =
		'<option value="">' + gettext("All Dimensions") + '</option>';
		categorySelect.innerHTML =
		'<option value="">' + gettext("All Categories") + '</option>';
   		url.searchParams.set('designspace_id', designspaceId);
		fetch(url)
		.then(res => res.json())
		.then(data => {
			renderDimensions(data.dimensions);
			renderCategories(data.categories);
		})
		.catch(err =>
			console.error(gettext('Error fetching design space structure:'), err)
		);
		});
	
		dimensionSelect.addEventListener('change', function () {
			dimensionId = this.value;
			designspaceId =
				designspaceSelect.options[designspaceSelect.selectedIndex].value;
			if (designspaceId) {
				url.searchParams.set('designspace_id', designspaceId);
			}
			url.searchParams.set('dimension_id', dimensionId);
			fetch(url)
			.then(res => res.json())
			.then(data => {
				renderCategories(data.categories, dimensionId);
			});
		});
	}
	const form = document.getElementById('filter-form');
	if (form) {
		form.addEventListener('submit', function (e) {
		e.preventDefault();
		const formData = new FormData(form);
		const params = new URLSearchParams(formData);

		fetch(`${window.location.pathname}?${params.toString()}`, {
			headers: { 'X-Requested-With': 'XMLHttpRequest' },
			credentials: 'same-origin'
		})
		.then(res => res.text())
		.then(html => {
			document.getElementById('guideline-results').innerHTML = html;
		});
	});
	}
	const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	tooltipTriggerList.forEach(function (tooltipTriggerEl) {
		new bootstrap.Tooltip(tooltipTriggerEl);
	});

	function renderDimensions(dimensions) {
		dimensionSelect.innerHTML =
			'<option value="">' + gettext("All Dimensions") + '</option>';

  		dimensions
		.forEach(dim => {
		const option = document.createElement('option');		
		option.value = dim.id;
		option.textContent =
			`${dim.designspace} > ${dim.name} (${dim.guideline_count})`;
		option.dataset.designspaceId = dim.designspace_id;
		dimensionSelect.appendChild(option);
		});
	}

	function renderCategories(categories, dimensionId = null) {
		categorySelect.innerHTML =
			'<option value="">' + gettext("All Categories") + '</option">';
		categories
		.filter(cat => !dimensionId || cat.dimension_id == dimensionId)
		.forEach(cat => {
			const option = document.createElement('option');
			option.value = cat.id;
			option.textContent =
				`${cat.designspace} > ${cat.dimension} > ${cat.name} (${cat.guideline_count})`;
			option.dataset.dimensionId = cat.dimension_id;
			option.dataset.designspaceId = cat.designspace_id;
			categorySelect.appendChild(option);
		});
	}
});
