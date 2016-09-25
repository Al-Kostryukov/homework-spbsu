#define _GNU_SOURCE

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/stat.h> 
#include <fcntl.h>


/*
 *
 * Helpful functions below up to Main path
 *
*/

 unsigned char get_byte(unsigned char dec, char i) {
 	return (dec & (1 << i)) >> i;
 }

 int index_of(char** arr, char* str) {
	int i = 0;
	
	while (arr[i]) {
		if (!strcmp(arr[i], str)) {
			return i;
		}

		i++;
	}

	return -1;
}

int arr_length(char** arr) {//return length without last NULL (e.g arr_length([1, 2, NULL]) == 2)
	int length = 0;

	while (arr[length]) {
		length++;
	}

	return length;
}


void remove_elements_from_array(char*** arr, int start, int count) {
	int i = start;
	int length = arr_length(*arr);

	while (i + count < length) {
		(*arr)[i] = (*arr)[i + count];
		i++;
	}

	(*arr)[i] = NULL;

	*arr = realloc(*arr, (i + 1) * sizeof(char*));
}


char** split(char* str, char separators[]) {
	int pos = 0;
	
	char** tokens = malloc(sizeof(char*));
	if (tokens == NULL) {
        	printf("alexShell: Not enough memory for operation\n");
        	exit(EXIT_FAILURE);
    }
	
	char* token = strtok(str, separators);
    
    while (token != NULL) {
    	tokens[pos] = token;
    	pos++;

    	tokens = realloc(tokens, (pos + 1) * sizeof(char*));
    	if (tokens == NULL) {
        	printf("alexShell: Not enough memory for operation\n");
        	exit(EXIT_FAILURE); 
      	}

        token = strtok(NULL, separators);
    }

    tokens[pos] = NULL;

    return tokens;
}




/*
 * Main part below
 *
*/



char* alexShell_readLine() {
	char* line = NULL;
	size_t len = 0;

	if (getline(&line, &len, stdin) == -1) {
		printf("Empty line\n");
		return NULL;
	}

	char** line_ = split(line, "\r\n");
	line = line_[0];
	free(line_);

	return line;
}

char** alexShell_parse(char* line) {// the simpliest parse - only spliting by |.
	char** commands = split(line, "|");
	return commands;
}

void alexShell_makeIoRedirections(char*** args, char pipe) {
	if (get_byte(pipe, 0) == 0) {
		int lti = index_of(*args, "<");		
	
		if (lti != -1) {
		    int fd = open((*args)[lti + 1], O_RDONLY, S_IRUSR | S_IWUSR);

		    if (fd == -1) {
		    	printf("alexShell: Can't open %s\n", (*args)[lti + 1]);
		    	exit(EXIT_FAILURE);	    	
		    }

		    dup2(fd, STDIN_FILENO);   // make stdin go from file
		    close(fd);

		    remove_elements_from_array(args, lti, 2);
		}
    }

    if (get_byte(pipe, 1) == 0) {
    	int gti = index_of(*args, ">");	

    	if (gti != -1) {
		    int fd = open((*args)[gti + 1], O_WRONLY | O_CREAT, S_IRUSR | S_IWUSR);

		    if (fd == -1) {
		    	printf("alexShell: Can't open %s\n", (*args)[gti + 1]);
		    	exit(EXIT_FAILURE);	    	
		    }

		    dup2(fd, STDOUT_FILENO);   // make stdout go to file
		    dup2(fd, STDERR_FILENO);   // make stderr go to file
		    close(fd);

		    remove_elements_from_array(args, gti, 2);
		}

		int ggti = index_of(*args, ">>");	

    	if (ggti != -1) {
		    int fd = open((*args)[ggti + 1], O_WRONLY | O_CREAT | O_APPEND, S_IRUSR | S_IWUSR);

		    if (fd == -1) {
		    	printf("alexShell: Can't open %s\n", (*args)[ggti + 1]);
		    	exit(EXIT_FAILURE);	    	
		    }

		    dup2(fd, STDOUT_FILENO);   // make stdout go to file
		    dup2(fd, STDERR_FILENO);   // make stderr go to file
		    close(fd);

		    remove_elements_from_array(args, ggti, 2);
		}
    }
}


int alexShell_execOneCommand(char* command, unsigned char pipe, int readfd, int writefd) {
	
	/* 
	 * char pipe is a type of pipe needed:
	 * 0: no pipe
	 * 1: only read from pipe
	 * 2: only write to pipe
	 * 3(1+2): read and write
	 *
	*/


	char** args = split(command, " ");

	if (arr_length(args) == 0) {
		_exit(EXIT_FAILURE);
	}
	
	alexShell_makeIoRedirections(&args, pipe);

	if (get_byte(pipe, 0) == 1) {
		dup2(readfd, STDIN_FILENO);   // make stdin go from pipefd	
		close(readfd);
    }

    if (get_byte(pipe, 1) == 1) {
    	dup2(writefd, STDOUT_FILENO);   // make stdout go to pipefd
    	dup2(writefd, STDERR_FILENO);   // make stderr go to pipefd
    	close(writefd);
    }


	if (execvp(args[0], args) == -1) {
		perror("alexShell");
	}


	free(args);
	_exit(EXIT_SUCCESS);
};

int alexShell_execCommands(char** commands) {
	int commands_len = arr_length(commands);	
	pid_t pid, wpid;

	if (commands_len == 0) {
    	return 0;
  	
  	} else if (commands_len == 1) {  		
  		pid = fork();

  		if (pid == 0) {// Child process
			alexShell_execOneCommand(commands[0], 0, 0, 0);
		} else if (pid < 0) {// Fork error
			perror("alexShell");
		} else {
			wait(NULL);
		}
  	
  	} else {  		
    	int pipefds_len = commands_len - 1;
    	
    	int** pipefds = malloc((pipefds_len) * sizeof(int*));
    	if (pipefds == NULL) {
    		printf("alexShell: Not enough memory for operation\n");
    		exit(EXIT_FAILURE);
    	}

  		for (int i = 0; i < pipefds_len; i++) {
			int* pipefd = malloc(2 * sizeof(int));

			if (pipefd == NULL) {
				printf("alexShell: Not enough memory for operation\n");
				exit(EXIT_FAILURE);
    		}
			
			if (pipe(pipefd) == -1) {
				perror("pipe");
				exit(EXIT_FAILURE);
			}

			pipefds[i] = pipefd;  		
  		}

  		for (int i = 0; i < commands_len; i++) {
			pid = fork();
			
			if (pid == 0) {// Child process				
				if (i == 0) {
					alexShell_execOneCommand(commands[i], 2, 0,                 pipefds[i][1]);
				} else if (i == commands_len - 1) {
					alexShell_execOneCommand(commands[i], 1, pipefds[i - 1][0], 0);
				} else {
					alexShell_execOneCommand(commands[i], 3, pipefds[i - 1][0], pipefds[i][1]);
				}

			} else if (pid < 0) {// Fork error
				perror("alexShell");
				break;

			} else {
				if (i > 0) {
					close(pipefds[i - 1][0]);
				}			

				if (i < pipefds_len) {
					close(pipefds[i][1]);
				}

				wait(NULL);
			}
  		}

  		//avoid memory leaks
  		for (int i = 0; i < pipefds_len; i++) {
			free(pipefds[i]);
		}

  		free(pipefds);
  	}	

	return 1;
}



int alexShell_startLoop() {
	while (1) {
		printf("alexShell> ");

		char* line = alexShell_readLine();

		if (!strcmp(line, "exit")) {
			break;
		}

		char** commands = alexShell_parse(line);		
		alexShell_execCommands(commands);

		//avoid memory leaks
		free(line);
		free(commands);
	}
}


int main() {	
    alexShell_startLoop();   
    
    return 0;
}