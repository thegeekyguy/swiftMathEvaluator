var delims = "*/+()[]{}^";

function swiftparser()
{
	this.eval = function(s)
	{
		s = s.replace(/ |\n|\r/g, "");
		
		s = this.addmathevent(s, "sin", Math.sin);
		s = this.addmathevent(s, "cos", Math.cos);
		s = this.addmathevent(s, "tan", Math.tan);
		s = this.addmathevent(s, "log", log);
		s = this.addmathevent(s, "ln", ln);
		s = this.addmathevent(s, "abs", Math.abs);
		s = this.addmathevent(s, "asin", Math.asin);
		s = this.addmathevent(s, "acos", Math.acos);
		s = this.addmathevent(s, "atan", Math.atan);
		s = this.addmathevent(s, "floor", Math.floor);
		s = this.addmathevent(s, "ceil", Math.ceil);
		s = this.addmathevent(s, "sqrt", Math.sqrt);
		s = this.addmathevent(s, "rad", function(n)
		{
			return n * Math.PI / 180;
		});
		
		s = s.replace(/e[\-\.0-9]|e[\+\-][\.0-9]/g, function(m)
		{
			var val = m.substring(1);
			if (val.substring(0, 1) == "+") val = val.substring(1);
			console.log(val);
			return "*" + Math.pow(10, +val);
		});
		
		s = s.replace(/[0-9][A-Za-z]+/g, function(m)
		{
			return m.substring(0, 1) + "*" + m.substring(1);
		});
		
		s = this.addvar(s, "pi", Math.PI);
		s = this.addvar(s, "e", Math.E);
		s = this.addvar(s, "tau", Math.PI * 2);
		s = this.addvar(s, "phi", (1 + Math.sqrt(5)) / 2);
		
		// Unknown Variable Handling
		var ev = s.match(/\b[A-Za-z]+\b/g);
		for (i in ev)
		{
			var evar = ev[i];
			console.error("Unknown Variable '" + evar + "'");
		}
		if (ev != null) return NaN;
		//////
		var op = s.match(/\(/g);
		var cl = s.match(/\)/g);
		
		// Parenthesis Handling
		if (op == null && cl != null || op != null && cl == null)
		{
			console.error("Unbalanced bracket count");
			return NaN;
		}
		if (op != null && cl != null)
		{
			if (op.length != cl.length)
			{
				console.error("Unbalanced bracket count");
				return NaN;
			}
		}
		//////////////////
		
		while (s.indexOf("(") != -1 && s.lastIndexOf(")") > s.lastIndexOf("("))
		{
			var fi = s.lastIndexOf("(") + 1;
			var si = s.indexOf(")", fi);
			var temp = s.substring(fi, si);
			s = s.substring(0, fi - 1) + this.leval(temp) + s.substring(si + 1);
		}
		
		return this.leval(s);
	};
	
	this.leval = function(s)
	{
		if (s.substring(0, 1) != "+")
			s = "+" + s;
		
		s = s.replace(/\-/g, "+-");
		s = s.replace(/\+\+\-/g, "+-");
		s = s.replace(/\+\-\+\-/g, "+");
		
		var res = 0;
		
		while (s.replace(/!/g, "") != s)
		{
			var l = s;
			s = s.replace(/[\-\.0-9]+!/g, function(m)
			{
				var n = m.substring(0, m.length - 1);
				return fact(n);
			});
			if (s == l)
				break;
		}
		
		while (s.replace(/\^/g, "") != s)
		{
			var l = s;
			s = s.replace(/[\-\.0-9]+[\^][\-\.0-9]+/g, function(m)
			{
				var b = m.substring(0, m.indexOf("^"));
				var pow = m.substring(m.indexOf("^") + 1);
				return Math.pow(b, pow);
			});
			if (s == l)
				break;
		}
		
		while (s.replace(/\*|\//g, "") != s)
		{
			var l = s;
			s = s.replace(/[\-\.0-9]+[\*\/][\-\.0-9]+/g, function(m)
			{
				if (m.indexOf("/") != -1)
				{
					var a = m.substring(0, m.indexOf("/"));
					var b = m.substring(m.indexOf("/") + 1);
					return divide(a, b);
				}
				else
				{
					var a = m.substring(0, m.indexOf("*"));
					var b = m.substring(m.indexOf("*") + 1);
					return multiply(a, b);
				}
			});
			if (s == l)
				break;
		}
		
		// Add Up Results
		while (s.indexOf("+") != -1)
		{
			var fi = getfirst(s.substring(1)) + 1;
			var n = s.substring(1, fi);
			
			if (res == .1 && +n == .2 || res == .2 && +n == .1) res = ".3";
			else res = add(res, n);
			
			s = s.substring(fi);
		}
		
		return res;
	};
	
	this.addmathevent = function(s, th, fn)
	{
		while (s.indexOf(th + "(") != -1)
		{
			var sub = s.substring(s.indexOf(th + "(") + th.length);
			var ep = endpar(sub);
			var rep = ep + s.indexOf(th + "(") + th.length + 1;
			var exp = sub.substring(1, ep);
			
			exp += ",";
			var ind = 0;
			
			while (ind < exp.lastIndexOf(","))
			{
				var esub = exp.substring(ind, exp.indexOf(",", ind));
				
				exp = exp.substring(0, ind) + this.eval(esub) + exp.substring(exp.indexOf(",", ind));
				ind = exp.indexOf(",", ind) + 1;
			}
			exp = exp.substring(0, exp.length - 1);
			
			eval("s = s.substring(0, s.indexOf(th + \"(\")) + fn(" + exp + ") + s.substring(rep);");
			
		}
		return s;
	};
	
	this.addvar = function(s, c, v)
	{
		var reg = new RegExp("\\b" + c + "\\b", "g");
		
		while (s.replace(reg, "") != s)
		{
			s = s.replace(reg, function(m)
			{
				return v;
			});
		}
		return s;
	};
}

function fact(n)
{
	if (n < 0) return NaN;
	if (n == 0) return 1;
	
	if (n == 1) return 1;
	else return multiply(n, fact(n - 1));
}

function getlast(s)
{
	var i = -1;
	var temp = delims;
	while (temp != "")
	{
		var d = temp.substring(0, 1);
		i = Math.max(i, s.lastIndexOf(d));
		
		temp = temp.substring(1);
	}
	return i;
}

function getfirst(s)
{
	var i = s.length;
	var temp = delims;
	while (temp != "")
	{
		var d = temp.substring(0, 1);
		i = addifexists(s, d, i);
		
		temp = temp.substring(1);
	}
	return i;
}

function addifexists(s, d, i)
{
	if (s.indexOf(d) != -1) i = Math.min(i, s.indexOf(d));
	return i;
}

function endpar(s)
{
	var end = s.length;
	var ind = 0;
	
	var as = 0;
	var ae = 0;
	while (s.indexOf("(", ind) != -1 || s.indexOf(")", ind) != -1)
	{
		var cp = s.substring(ind);
		if (cp.indexOf("(") < cp.indexOf(")") && cp.indexOf("(") != -1)
			as++;
		else if (cp.indexOf(")") != -1)
			ae++;
		
		if (cp.indexOf("(") < cp.indexOf(")") && cp.indexOf("(") != -1) ind = s.indexOf("(", ind) + 1;
		else if (cp.indexOf(")") != -1) ind = s.indexOf(")", ind) + 1;
		
		if (as == ae)
		{
			end = ind;
			break;
		}
	}
	
	return end - 1;
}

function log(n, b)
{
	var base = b || 10;
	return Math.log(n) / Math.log(base);
}

function ln(n)
{
	return log(n, Math.E);
}
