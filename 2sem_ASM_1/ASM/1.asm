ldc 2
ldc 1
st 0
st 1
ldc 0
st 2
ldc 0
ldc 2
st 3
st 4
compare: ld 4
ldc 1
cmp
br counter
ld 3
ret
counter: ld 2
ldc 1
add
st 2
ld 0
ld 1
ld 1
st 0
add
st 1
ld 2
ldc 3
cmp
br counter
st 2
ldc 2000000
ld 1
cmp
br compare2
ld 3
ldc 2000000
add
ret
compare2: ldc 1
cmp
br sum
ld 3
ret
sum: ld 1
ld 3
add
st 3
ld 3
br counter
ret
