module.exports = function solveSudoku(matrix) {
	var resultArr = solution(matrix);
	for ( var i=0; i<9; i++) {
		for ( var j=0; j<9; j++ ) {
			matrix[i][j] = resultArr[i][j][0];
		}
	}
	return matrix;
};


function solution(matrix){
	//Создаем массив с привязкой к каждому элементу матрицы массива возможных значений
	var arr = [];
	for ( var i=0; i<9; i++) {
		arr[i] = [];
		for ( var j=0; j<9; j++ ) {
			if ( matrix[i][j] ) {
				arr[i][j] = [matrix[i][j], []];
			}
			else {
				arr[i][j] = [0, [1, 2, 3, 4, 5, 6, 7, 8, 9]];
			}
		}
	}

	var counter = 0;
	do {
		//Поиск возможных значений по строке, столбцу и сектору
		counter = findElements();
	} while (counter);

	if ( !isSolved(arr) && !isFailed() ) {
		//Поиск с возвратом
		backtracking();
	}

	return arr;


	function findElements() {
		var counter = 0;
		for ( var i=0; i<9; i++) {
			for ( var j=0; j<9; j++) {
				if ( arr[i][j][0] != 0 ) continue;

				var row = arr[i].map(item => item[0]).filter(item => item > 0);
				var column = arr.map(item => item[j][0]).filter(item => item > 0);
				var section = sectionElements(i, j);

				var possibleValues = arr[i][j][1];
				possibleValues = arraysDifference(possibleValues, row); //Сравниваем возможные значения с цифрами в строке
				possibleValues = arraysDifference(possibleValues, column); //Сравниваем возможные значения с цифрами в столбце
				possibleValues = arraysDifference(possibleValues, section); //Сравниваем возможные значения с цифрами в секции

				arr[i][j][1] = possibleValues;
				//Если возможное значение одно, то вписываем его в матрицу
				if ( possibleValues.length == 1 ) {
					arr[i][j][0] = possibleValues[0];
					counter++;
				}
			}
		}
	return counter;
	};


function sectionElements(i, j) {
	var elements = [];
	var x = Math.floor(i/3)*3;
	var y = Math.floor(j/3)*3;
		for ( var a=0; a<3; a++ ) {
			for ( var b=0; b<3; b++ ) {
				if ( arr[x+a][y+b][0] != 0 ) {
					elements.push(arr[x+a][y+b][0]);
				}
			}
		}
		return elements;
	};


	function arraysDifference(arr1, arr2) {
		return arr1.filter(function(i) {return arr2.indexOf(i) < 0;});
	};


	function isSolved(arr) {
		for ( var i=0; i<9; i++) {
			for ( var j=0; j<9; j++ ) {
				if ( arr[i][j][0] == 0 ) {
					return false;
				}
			}
		}
		return true;
	}; 


	function isFailed() {
		for ( var i=0; i<9; i++) {
			for ( var j=0; j<9; j++ ) {
				if ( arr[i][j][0] == 0 && !arr[i][j][1].length ) {
					return true;
				}
			}
		}
		return false;
	};


	function backtracking() {
		var matrix = [[], [], [], [], [], [], [], [], []];
		var iMin, jMin, possibleValues;
		//Находим нерешенный элемент с наименьшим количеством возможных значений
		for ( var i=0; i<9; i++ ) {
			for ( var j=0; j<9; j++ ) {
				matrix[i][j] = arr[i][j][0];
				if ( arr[i][j][0] == 0 && (arr[i][j][1].length < possibleValues || !possibleValues) ) {
					possibleValues = arr[i][j][1].length;
					iMin = i;
					jMin = j;
				}
			}
		}
		//Подставляем одно из возможных значений и пытаемся решить полученное судоку через рекурсию
		for ( var x=0; x<possibleValues; x++ ) {
			matrix[iMin][jMin] = arr[iMin][jMin][1][x];
			var mass = solution(matrix);
			//Если подстановка возможного значения помогла решить судоку, то записываем полученную матрицу в начальную
			if ( isSolved(mass) ) {
				resultArr = mass;
				for ( var i=0; i<9; i++ ) {
					for ( var j=0; j<9; j++ ) {
						if ( arr[i][j][0] == 0 ) {
							arr[i][j][0] = resultArr[i][j][0];
						}
					}
				}
				return;
			}
		}
	}
}