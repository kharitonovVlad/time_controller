"use strict";

window.onload = function () {
	function calculationOfTotalTime(actions) {
		const allSum = { sumHours: 0, sumMinutes: 0, sumSeconds: 0 };
		const studySum = { sumHours: 0, sumMinutes: 0, sumSeconds: 0 };
		const workSum = { sumHours: 0, sumMinutes: 0, sumSeconds: 0 };
		const foodSum = { sumHours: 0, sumMinutes: 0, sumSeconds: 0 };
		const restSum = { sumHours: 0, sumMinutes: 0, sumSeconds: 0 };
		const yukiSum = { sumHours: 0, sumMinutes: 0, sumSeconds: 0 };

		function makeSum(action, objToSum) {
			objToSum.sumHours = objToSum.sumHours + +action.timeLeft.split(":")[0];
			objToSum.sumMinutes = objToSum.sumMinutes + +action.timeLeft.split(":")[1];
			objToSum.sumSeconds = objToSum.sumSeconds + +action.timeLeft.split(":")[2];
		}

		function formatingTime(objToFormat) {
			if (objToFormat.sumSeconds > 59) {
				const ost = objToFormat.sumSeconds % 60;
				objToFormat.sumMinutes = objToFormat.sumMinutes + (objToFormat.sumSeconds - ost) / 60;
				objToFormat.sumSeconds = objToFormat.sumSeconds - (objToFormat.sumSeconds - ost);
			}
			if (objToFormat.sumMinutes > 59) {
				const ost = objToFormat.sumMinutes % 60;
				objToFormat.sumHours = objToFormat.sumHours + (objToFormat.sumMinutes - ost) / 60;
				objToFormat.sumMinutes = objToFormat.sumMinutes - (objToFormat.sumMinutes - ost);
			}
		}

		function paintRows(actionToPaint, successHoursCount, actionResultRowId, reverse) {
			const actionResultRow = document.querySelector(`#${actionResultRowId}`);
			if (reverse ? actionToPaint.sumHours < successHoursCount : actionToPaint.sumHours >= successHoursCount) {
				actionResultRow.classList.toggle("table-danger", false);
				actionResultRow.classList.add("table-success");
			} else {
				actionResultRow.classList.toggle("table-success", false);
				actionResultRow.classList.add("table-danger");
			}
		}

		actions.forEach((action) => {
			makeSum(action, allSum);

			switch (action.action) {
				case "Учеба":
					makeSum(action, studySum);
					break;
				case "Работа":
					makeSum(action, workSum);
					break;
				case "Еда":
					makeSum(action, foodSum);
					break;
				case "Отдых":
					makeSum(action, restSum);
					break;
				case "Юки":
					makeSum(action, yukiSum);
					break;
			}
		});

		formatingTime(allSum);
		formatingTime(studySum);
		formatingTime(workSum);
		formatingTime(foodSum);
		formatingTime(restSum);
		formatingTime(yukiSum);

		paintRows(studySum, 4, "studyResultRow");
		paintRows(workSum, 4, "workResulttRow");
		paintRows(foodSum, 1, "foodResultRow", true);
		paintRows(restSum, 1, "restResultRow", true);

		const allResult = document.querySelector("#allResult");
		const studyResult = document.querySelector("#studyResult");
		const workResult = document.querySelector("#workResult");
		const foodResult = document.querySelector("#foodResult");
		const restResult = document.querySelector("#restResult");
		const yukiResult = document.querySelector("#yukiResult");

		allResult.innerHTML = `${timePipe(allSum.sumHours)}:${timePipe(allSum.sumMinutes)}:${timePipe(allSum.sumSeconds)}`;
		studyResult.innerHTML = `${timePipe(studySum.sumHours)}:${timePipe(studySum.sumMinutes)}:${timePipe(studySum.sumSeconds)}`;
		workResult.innerHTML = `${timePipe(workSum.sumHours)}:${timePipe(workSum.sumMinutes)}:${timePipe(workSum.sumSeconds)}`;
		foodResult.innerHTML = `${timePipe(foodSum.sumHours)}:${timePipe(foodSum.sumMinutes)}:${timePipe(foodSum.sumSeconds)}`;
		restResult.innerHTML = `${timePipe(restSum.sumHours)}:${timePipe(restSum.sumMinutes)}:${timePipe(restSum.sumSeconds)}`;
		yukiResult.innerHTML = `${timePipe(yukiSum.sumHours)}:${timePipe(yukiSum.sumMinutes)}:${timePipe(yukiSum.sumSeconds)}`;
	}

	function timePipe(time) {
		if (time.toString().length === 1) {
			return `0${time}`;
		}
		return time;
	}

	function setAction() {
		const action = document.querySelector("#action");
		const endTime = document.querySelector("#endTime");
		let endActionTime;
		if (endTime.value) {
			const hours = endTime.value.split(":")[0];
			const minutes = endTime.value.split(":")[1];
			endActionTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), hours, minutes, 0);
		} else {
			endActionTime = new Date(Date.now());
		}
		const lastActionTime = actions.length > 0 ? new Date(actions[actions.length - 1].time) : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 8);
		const timeDifference = new Date(endActionTime - lastActionTime);
		const result = `${timePipe(timeDifference.getHours() - 3)}:${timePipe(timeDifference.getMinutes())}:${timePipe(timeDifference.getSeconds())}`;

		const newAction = {
			timeLeft: result,
			action: action.value,
			time: endActionTime,
			from: `${timePipe(lastActionTime.getHours())}:${timePipe(lastActionTime.getMinutes())}:${timePipe(lastActionTime.getSeconds())}`,
			to: `${timePipe(endActionTime.getHours())}:${timePipe(endActionTime.getMinutes())}:${timePipe(endActionTime.getSeconds())}`,
		};

		actions.push(newAction);
		localStorage.setItem("actions", JSON.stringify(actions));
		calculationOfTotalTime(actions);

		const tdSpendedTime = document.createElement("td");
		const tdActionTitle = document.createElement("td");
		const tdPeriod = document.createElement("td");
		const tr = document.createElement("tr");
		tdSpendedTime.innerHTML = `${result}`;
		tdActionTitle.innerHTML = `${action.value}`;
		tdPeriod.innerHTML = `с ${timePipe(lastActionTime.getHours())}:${timePipe(lastActionTime.getMinutes())}:${timePipe(lastActionTime.getSeconds())} 
		по ${timePipe(endActionTime.getHours())}:${timePipe(endActionTime.getMinutes())}:${timePipe(endActionTime.getSeconds())}`;
		tr.append(tdSpendedTime);
		tr.append(tdActionTitle);
		tr.append(tdPeriod);
		tbodyActions.append(tr);
	}

	function clearStorage() {
		localStorage.clear();
		actions = [];
		calculationOfTotalTime(actions);
		while (tbodyActions.firstChild) {
			tbodyActions.removeChild(tbodyActions.firstChild);
		}
		var exampleModal = document.getElementById("exampleModal");
		modal.hide();
	}

	const setActionButton = document.querySelector("#setActionButton");
	const clearButton = document.querySelector("#clearButton");
	const tbodyActions = document.querySelector("#actions");
	const today = document.querySelector("#today");
	setActionButton.addEventListener("click", setAction);
	clearButton.addEventListener("click", clearStorage);

	let actions = JSON.parse(localStorage.getItem("actions")) ? JSON.parse(localStorage.getItem("actions")) : [];
	today.innerHTML = `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`;

	if (actions) {
		calculationOfTotalTime(actions);
		actions.forEach((action) => {
			const tdSpendedTime = document.createElement("td");
			const tdActionTitle = document.createElement("td");
			const tdPeriod = document.createElement("td");
			const tr = document.createElement("tr");
			tdSpendedTime.innerHTML = `${action.timeLeft}`;
			tdActionTitle.innerHTML = `${action.action}`;
			tdPeriod.innerHTML = `с ${action.from} по ${action.to}`;
			tr.append(tdSpendedTime);
			tr.append(tdActionTitle);
			tr.append(tdPeriod);
			tbodyActions.append(tr);
		});
	}

	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl);
	});
	var exampleModal = document.getElementById("exampleModal");
	const modal = new bootstrap.Modal(exampleModal);
};
