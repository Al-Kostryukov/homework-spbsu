    ldc  208574561
    st 0
    ldc 1
    ld 0
    sub
    st 1
    ld 0
    st 2
f1:
	ldc 1
	ld 1
	cmp
	br f2
    st 5
	jmp end
f2:
    st 5
    ld 1
	ld 2
	cmp
	st 3
	ld 3
	br f3
	ld 1
	st 0
	ld 0
	st 2
	ldc 1
	ld 1
	sub
	st 1
	jmp f1
f3:
    st 5
	ldc 1
	ld 3
	sub
	br f4
    st 5
	ld 1
	ld 2
	sub
	st 2
	jmp f1
f4:
    st 5
	ldc 1
	ld 1
	sub
	st 1	
	ld 0
	st 2
	jmp f1
end:
	ld 0
	ret
