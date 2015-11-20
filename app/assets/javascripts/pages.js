/* global moment */

$(document).on('page:change', function() {

	function editEvent(event, element, revertFunc) {
		var allDay = !event.start.hasTime() && !event.end.hasTime();
		var starttime = moment(event.start).format();
		var endtime = moment(event.end).format();
		var eventData = {
			event: {
				start: starttime,
				end: endtime,
				allDay: allDay
			}
		};

		$.ajax({
			url: 'events/' + event.id,
			type: 'PATCH',
			dataType: 'json',
			data: eventData
		})
		.done(function(eventData) {
			$('#calendar').fullCalendar('updateEvent', event);
			console.log('success');
		})
		.fail(function(e) {
			revertFunc();
			alert('Error processing your request: ' + e.responseText);
		});
		console.log(event);
	}

	$('#calendar').fullCalendar({
		height: 700,
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		selectable: true,
		selectHelper: true,
		businessHours: {
			start: '09:00',
			end: '20:00',
			dow: [ 1, 2, 3, 4, 5 ]
		},
		select: function(start, end) {
			var title = prompt('Event Title:');
			var eventData;
			if (title) {
				allDay = !start.hasTime() && !end.hasTime();
				starttime = moment(start).format();
				endtime= moment(end).format();
				eventData = {
					event: {
						title: title,
						start: starttime,
						end: endtime,
						allDay: allDay
					}
				};
				$.ajax({
					url: 'events',
					type: 'POST',
					dataType: 'json',
					data: eventData
				})
				.done(function(eventData) {
					$('#calendar').fullCalendar('renderEvent', eventData, true);
				})
				.fail(function(e) {
					alert('Error processing your request: ' + e.responseText);
				});
			}
			$('#calendar').fullCalendar('unselect');
		},

		eventClick: function(event, element) {
			var title = prompt('Event Title:', event.title, { buttons: { Ok: true, Cancel: false} });

			if (title) {
				event.title = title;
				eventData = {
					event: {
						title: title
					}
				};

				$.ajax({
					url: 'events/' + event.id,
					type: 'PATCH',
					dataType: 'json',
					data: eventData
				})
				.done(function(eventData) {
					$('#calendar').fullCalendar('updateEvent', event);
					console.log('success');
				});
			}
		},

		eventDrop: function(event, element, revertFunc) {
			editEvent(event, element, revertFunc);
		},

		eventResize: function(event, element, revertFunc) {
			editEvent(event, element, revertFunc);
		},

		eventRender: function(event, element) {
			element.append( '<span class="delete">X</span>' );

			var m = moment();

			if (event.allDay === true) {
				element.css('background-color', '#FF5252');
			} else if (m > event.end) {
				element.css('background-color', '#CFD8DC');
			} else if (m < event.start) {
				element.css('background-color', '#303F9F');
			} else if (true) {
				element.css('background-color', '#4CAF50');
			}

			element.find('.delete').click(function() {
				var con = confirm('Are you sure to delete this event permanently?');
				if (con === true) {
					$.ajax({
						url: 'events/' + event.id,
						type: 'DELETE'
					});

					$('#calendar').fullCalendar('removeEvents',event._id);
				}
			});
		},

		events: {
			url: 'events',
			type: 'GET',
			cache: true
		},

		editable: true,
		eventLimit: true
	});
});
