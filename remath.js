// Aimed to re-create logical math
var acc = 50;

function add(a, b)
{
	a = "" + a;
	b = "" + b;
	var ta = +a;
	var tb = +b;
	
	if (ta < 0 && tb >= 0) return "-" + subtract(a.replace(/\-/g, ""), b);
	if (ta >= 0 && tb < 0 && ta < -tb) return "-" + subtract(b.replace(/\-/g, ""), a);
	if (ta >= 0 && tb < 0 && ta > -tb) return subtract(a, b.replace(/\-/g, ""));
	if (ta < 0 && tb < 0) return "-" + add(a.replace(/\-/g, ""), b.replace(/\-/g, ""));
	
	if (a.indexOf(".") == -1) a += ".";
	if (b.indexOf(".") == -1) b += ".";
	
	var fa = a.substring(0, a.indexOf("."));
	var sa = a.substring(a.indexOf(".") + 1);
	
	var fb = b.substring(0, b.indexOf("."));
	var sb = b.substring(b.indexOf(".") + 1);
	
	while (fa.length < fb.length) fa = "0" + fa;
	while (fb.length < fa.length) fb = "0" + fb;
	
	while (sa.length < sb.length) sa += "0";
	while (sb.length < sa.length) sb += "0";
	
	var dpos = fa.length;
	
	var ra = fa + sa;
	var rb = fb + sb;
	
	var apos = ra.length;
	var rem = 0;
	var res = "";
	
	while (apos > 0)
	{
		var na = ra.substring(apos - 1, apos);
		var nb = rb.substring(apos - 1, apos);
		
		var temp;
		if (rem != 0)
		{
			temp = "" + (+na + +nb + +rem);
			rem = 0;
		}
		else temp = "" + (+na + +nb);
		
		if (temp.length > 1 && apos > 1)
		{
			rem = temp.substring(0, 1);
			temp = temp.substring(1);
		}
		else if (temp.length > 1 && apos == 1)
			dpos++;
		
		res = temp + res;
		
		apos--;
	}
	res = res.substring(0, dpos) + "." + res.substring(dpos);
	if (res.substring(res.length - 1, res.length) == ".") res = res.substring(0, res.length - 1);
	
	return res;
}

function subtract(a, b)
{
	a = "" + a;
	b = "" + b;
	var ta = +a;
	var tb = +b;
	
	if (ta < 0 && tb >= 0) return "-" + add(a.replace(/\-/g, ""), b);
	if (ta >= 0 && tb < 0) return add(a, b.replace(/\-/g, ""));
	if (ta < 0 && tb < 0 && ta < tb) return "-" + subtract(a.replace(/\-/g, ""), b.replace(/\-/g, ""));
	if (ta < 0 && tb < 0 && ta > tb) return subtract(b.replace(/\-/g, ""), a.replace(/\-/g, ""));
	if (ta < 0 && tb < 0 && ta == tb) return "0";
	
	if (a.indexOf(".") == -1) a += ".";
	if (b.indexOf(".") == -1) b += ".";
	
	var fa = a.substring(0, a.indexOf("."));
	var sa = a.substring(a.indexOf(".") + 1);
	
	var fb = b.substring(0, b.indexOf("."));
	var sb = b.substring(b.indexOf(".") + 1);
	
	while (fa.length < fb.length) fa = "0" + fa;
	while (fb.length < fa.length) fb = "0" + fb;
	
	while (sa.length < sb.length) sa += "0";
	while (sb.length < sa.length) sb += "0";
	
	var dpos = fa.length;
	
	var ra = fa + sa;
	var rb = fb + sb;
	
	var apos = ra.length - 1;
	
	var aa = [];
	var ab = [];
	
	for (var i = 0; i <= ra.length; i++)
	{
		aa.push(ra.substring(i, i + 1));
	}
	for (var i = 0; i <= rb.length; i++)
	{
		ab.push(rb.substring(i, i + 1));
	}
	var res = "";
	
	while (apos >= 0)
	{
		var na = aa[apos];
		var nb = ab[apos];
		
		if (na - nb < 0)
		{
			var temp = apos - 1;
			while (aa[temp] == "0")
			{
				aa[temp] = "10";
				temp--;
			}
			aa[temp] = "" + (+aa[temp] - 1);
			
			na = "" + +(na + 10);
		}
		
		var tres = +na - +nb;
		res = tres + res;
		
		apos--;
	}
	res = res.substring(0, dpos) + "." + res.substring(dpos);
	if (res.substring(res.length - 1, res.length) == ".") res = res.substring(0, res.length - 1);
	
	return res;
}

function divide(a, b)
{
    if (b === 0){ return "Infinity"; }
    
    a = "" + a;
    b = "" + b;
    
    // Divide Integers
    var ind = a.length - b.length + 1;
    if (a.indexOf(".") != -1) ind = a.indexOf(".") - b.length + 1;
    
    var l = b.length;
    // 100 / 3
    // . goes to 3rd index (a length)
    var subnum = +a.substring(0, l);    // Subnum would be 1
    var min = +a.substring(0, l);       // Min represents the number in total subtracted
    var mult;
    
    var res = "";
	
	var ca = a.replace(/\./g, "");
    
    for (var i = 1; i <= acc; i++){
		mult = Math.floor(min / b);
		
		res += mult + "";
		
		if (l + 1 > ca.length)
			ca += "0";
		
		subnum = +ca.substring(l, l + 1);
		min = (+min - (mult * b)) + "" + +subnum;
		
		l++;
		if (min == 0) break;
    }
    
    res = res.substring(0, ind) + "." + res.substring(ind);
    
    while (res.substring(0, 1) == "0")
    {
        res = res.substring(1);
    }
    if (res.replace(/[0-9]/g, "") == res) res = "0";
    if (res.substring(0, 1) == ".") res = "0" + res;
    
    if (res.substring(res.length - 1, res.length) == ".") res = res.substring(0, res.length - 1);
    
    return res;
}

function multiply(a, b)
{
	a = "" + a;
	b = "" + b;
	a = def(a);
	b = def(b);
	
	if (+a < 0 && +b >= 0) return "-" + multiply(a.replace(/\-/g, ""), b);
	else if (+a >= 0 && +b < 0) return "-" + multiply(a, b.replace(/\-/g, ""));
	else if (+a < 0 && +b < 0) return multiply(a.replace(/\-/g, ""), b.replace(/\-/g, ""));
	
	var zeros = "";
	var res = "";
	
	if (a.indexOf(".") == -1) a += ".";
	if (b.indexOf(".") == -1) b += ".";
	
	var fa = a.substring(0, a.indexOf("."));
	var sa = a.substring(a.indexOf(".") + 1);
	
	var fb = b.substring(0, b.indexOf("."));
	var sb = b.substring(b.indexOf(".") + 1);
	
	while (fa.length < fb.length) fa = "0" + fa;
	while (fb.length < fa.length) fb = "0" + fb;
	
	while (sa.length < sb.length) sa += "0";
	while (sb.length < sa.length) sb += "0";
	
	decloc = (sa.length + sb.length);	// Decimal places
	
	a = fa + sa;
	b = fb + sb;
	
	var tf;
	var tadd = "";
	var af;
	var rem = 0;
	
	for (var i = b.length; i > 0; i--)
	{
		tf = +b.substring(i - 1, i);
		
		for (var z = a.length; z > 0; z--)
		{
			af = +a.substring(z - 1, z);
			var temp = "" + (af * tf);
			
			if (z == 1)
			{
				temp = "" + (+temp + rem);
				rem = 0;
			}
			else if (temp.length > 1)
			{
				var lrem = rem;
				rem = +temp.substring(0, 1);
				
				temp = "" + (+temp.substring(1) + +lrem);
				
			}
			else
			{
				temp = "" + (+temp + rem);
				rem = 0;
			}
			
			tadd = temp + "" + tadd;
			
		}
		tadd += zeros;
		res = add(res, tadd);
		
		tf = "";
		tadd = "";
		rem = 0;
		zeros += "0";
	}
	decloc = res.length - decloc;
	res = res.substring(0, decloc) + "." + res.substring(decloc);
	
	if (res.substring(res.length - 1, res.length) == ".") res = res.substring(0, res.length - 1);
	res = replaceZeros(res);
	if (res.substring(res.length - 1, res.length) == ".") res = res.substring(0, res.length - 1);
	
	return res;
}

function replaceZeros(s)
{
	if (s.length == 1) return s;
	
	while (s.substring(s.length - 1, s.length) == "0" && s.indexOf(".") != -1 && s.length - 1 > s.indexOf(".")) s = s.substring(0, s.length - 1);
	while (s.substring(0, 1) == "0") s = s.substring(1);
	if (s.substring(0, 1) == ".") s = "0" + s;
	
	return s;
}

function def(s)
{
	s = s.replace(/\+/g, "");
	if (s.substring(0, 1) == ".") s = "0" + s;
	
	return s;
}
