#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/stat.h> 
#include <fcntl.h>



 


char* alexShell_readLine() {
	char* line = NULL;
	size_t len = 0;

	if (getline(&line, &len, stdin) == -1) {
		printf("Empty line\n");
		return NULL;
	}

	return line;
}


char** alexShell_parse(char* line) {
	char separators[] = " \t\r\n\a";
	int pos = 0;
	
	char** tokens = malloc(sizeof(char*));
	if (!tokens) {
        	printf("alexShell: Not enough memory for operation\n");
        	exit(EXIT_FAILURE);
    }
	
	char* token = strtok(line, separators);
    
    while (token != NULL) {
    	tokens[pos] = token;
    	pos++;

    	tokens = realloc(tokens, (pos + 1) * sizeof(char*));
    	if (!tokens) {
        	printf("alexShell: Not enough memory for operation\n");
        	exit(EXIT_FAILURE); 
      	}

        token = strtok(NULL, separators);
    }

    tokens[pos] = NULL;

    return tokens;
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

void make_io_redirections(char** args) {
	int gti = index_of(args, ">");		
	
	if (gti != -1) {
	    int fd = open(args[gti + 1], O_WRONLY | O_CREAT, S_IRUSR | S_IWUSR);

	    dup2(fd, 1);   // make stdout go to file
	    dup2(fd, 2);   // make stderr go to file

	    close(fd);

	    args[gti] = NULL;

	}
/*
	int gtgti = index_of(args, ">>");		
	
	if (gtgti != -1) {
	    int fd = open(args[gti + 1], O_RDWR | O_CREAT, S_IRUSR | S_IWUSR);

	    dup2(fd, 1);   // make stdout go to file
	    dup2(fd, 2);   // make stderr go to file

	    close(fd);

	    args[gti] = NULL;
	}*/



	int lti = index_of(args, "<");		
	
	if (lti != -1) {
	    int fd = open(args[lti + 1], O_RDONLY, S_IRUSR | S_IWUSR);
	    if(!fd) {

	    }

	    dup2(fd, 0);   // make stdin go to file

	    close(fd);

	    args[lti] = NULL;
	}
}



int alexShell_exec(char** args) {
	if (args[0] == NULL) {
    	return 1;
  	}

	pid_t pid, wpid;
	int status;

	pid = fork();

	if (pid == 0) {// Child process
		//make_io_redirections(args);

		if (execvp(args[0], args) == -1) {
			perror("alexShell");
		}
		exit(EXIT_FAILURE);
	
	} else if (pid < 0) {// Fork error
		perror("alexShell");
	} else {
		do {
			wpid = waitpid(pid, &status, WUNTRACED);
		} while (!WIFEXITED(status) && !WIFSIGNALED(status));
	}

	return 1;
}





int alexShell_startLoop() {
	while (1) {
		printf("alexShell> ");

		char* line = alexShell_readLine();
		char** args = alexShell_parse(line);
		
		alexShell_exec(args);

		free(line);
		free(args);
	}
}


int main() {
    alexShell_startLoop();
    return 0;
}